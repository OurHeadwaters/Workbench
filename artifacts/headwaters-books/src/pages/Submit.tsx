import { useState, useRef } from "react";
import { 
  useListSubmissions, 
  useCreateSubmission,
  useListCostCentres,
  useListAccounts,
  getListSubmissionsQueryKey
} from "@workspace/api-client-react";
import { customFetch } from "@workspace/api-client-react";
import { SubmissionKind } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription
} from "@/components/ui/form";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Loader2, Plus, Receipt, Info, Paperclip, X as XIcon, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const submitSchema = z.object({
  kind: z.nativeEnum(SubmissionKind),
  costCentreCode: z.string().min(1, "Cost centre required"),
  occurredOn: z.string().min(1, "Date required"),
  vendor: z.string().min(1, "Vendor required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  description: z.string().min(1, "Description required"),
  notes: z.string().optional(),
  suggestedAccountCode: z.string().optional(),
  itemSku: z.string().optional(),
  itemName: z.string().optional(),
  quantity: z.coerce.number().optional(),
  unit: z.string().optional(),
});

interface PendingFile {
  file: File;
  previewUrl: string;
}

interface UploadedAttachment {
  storageRef: string;
  originalFilename: string;
  contentType: string;
  fileSize: number;
}

async function uploadReceiptFile(file: File): Promise<UploadedAttachment> {
  const urlResp = await customFetch<{ uploadURL: string; objectPath: string }>(
    "/api/bookkeeper/uploads/request-url",
    {
      method: "POST",
      body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
    }
  );

  const putResponse = await fetch(urlResp.uploadURL, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!putResponse.ok) {
    throw new Error(
      `Failed to upload "${file.name}" to storage (HTTP ${putResponse.status} ${putResponse.statusText}). Please try again.`
    );
  }

  return {
    storageRef: urlResp.objectPath,
    originalFilename: file.name,
    contentType: file.type,
    fileSize: file.size,
  };
}

export default function Submit() {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: page, isLoading: isLoadingList } = useListSubmissions({ mine: true });
  const { data: costCentresData } = useListCostCentres();
  const { data: accountsData } = useListAccounts();
  
  const createSub = useCreateSubmission();

  const form = useForm<z.infer<typeof submitSchema>>({
    resolver: zodResolver(submitSchema),
    defaultValues: {
      kind: "expense",
      costCentreCode: "",
      occurredOn: format(new Date(), "yyyy-MM-dd"),
      vendor: "",
      amount: 0,
      description: "",
      notes: "",
      suggestedAccountCode: ""
    }
  });

  const kind = form.watch("kind");

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(val);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const newEntries = files.map((file) => ({
      file,
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
    }));
    setPendingFiles((prev) => [...prev, ...newEntries]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setPendingFiles((prev) => {
      const entry = prev[index];
      if (entry?.previewUrl) URL.revokeObjectURL(entry.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onSubmit = async (values: z.infer<typeof submitSchema>) => {
    setIsSubmitting(true);
    try {
      let attachments: UploadedAttachment[] = [];
      if (pendingFiles.length > 0) {
        try {
          attachments = await Promise.all(pendingFiles.map((pf) => uploadReceiptFile(pf.file)));
        } catch {
          toast.error("Failed to upload one or more receipt photos. Please try again.");
          setIsSubmitting(false);
          return;
        }
      }

      createSub.mutate({
        data: {
          kind: values.kind,
          costCentreCode: values.costCentreCode,
          occurredOn: values.occurredOn,
          vendor: values.vendor,
          amount: values.amount,
          description: values.description,
          notes: values.notes || undefined,
          suggestedAccountCode: values.suggestedAccountCode || undefined,
          itemSku: values.itemSku || undefined,
          itemName: values.itemName || undefined,
          quantity: values.quantity || undefined,
          unit: values.unit || undefined,
          attachments: attachments.length > 0 ? attachments : undefined,
        }
      }, {
        onSuccess: () => {
          toast.success("Receipt submitted successfully");
          pendingFiles.forEach((pf) => { if (pf.previewUrl) URL.revokeObjectURL(pf.previewUrl); });
          setPendingFiles([]);
          form.reset({
            kind: values.kind,
            costCentreCode: values.costCentreCode,
            occurredOn: format(new Date(), "yyyy-MM-dd"),
            vendor: "",
            amount: 0,
            description: "",
            notes: "",
            suggestedAccountCode: ""
          });
          queryClient.invalidateQueries({ queryKey: getListSubmissionsQueryKey() });
        },
        onError: (err: Error) => {
          toast.error(err.message || "Failed to submit receipt");
        },
        onSettled: () => {
          setIsSubmitting(false);
        }
      });
    } catch {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">Pending</Badge>;
      case 'approved': return <Badge variant="secondary" className="bg-green-500/10 text-green-600">Approved</Badge>;
      case 'rejected': return <Badge variant="secondary" className="bg-red-500/10 text-red-600">Rejected</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Submit Receipt</h1>
        <p className="text-muted-foreground mt-1">Upload expenses or inventory receipts for bookkeeping review.</p>
      </div>

      <Card className="border-primary/20 shadow-sm">
        <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            New Submission
          </CardTitle>
          <CardDescription>All submissions must include an accurate total and description.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="kind"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="expense">General Expense</SelectItem>
                          <SelectItem value="inventory_receipt">Inventory Receipt</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="costCentreCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project / Location</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cost centre" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {costCentresData?.map(cc => (
                            <SelectItem key={cc.code} value={cc.code}>
                              {cc.code} - {cc.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="occurredOn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date on Receipt</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vendor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendor / Store Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Canadian Tire" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                          <Input type="number" step="0.01" className="pl-7 text-lg font-medium" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What was purchased?</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Supplies for workshop" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {kind === "inventory_receipt" && (
                <div className="p-4 bg-muted/30 border border-border rounded-md space-y-4">
                  <h4 className="font-medium text-sm text-foreground flex items-center gap-2">
                    <Receipt className="w-4 h-4" />
                    Inventory Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="itemSku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">SKU</FormLabel>
                          <FormControl><Input className="h-8" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="itemName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Item Name</FormLabel>
                          <FormControl><Input className="h-8" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Quantity</FormLabel>
                          <FormControl><Input type="number" className="h-8" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Unit</FormLabel>
                          <FormControl><Input className="h-8" placeholder="e.g. kg, box" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="suggestedAccountCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suggested Category (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="I don't know" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">I don't know</SelectItem>
                          {accountsData?.filter(a => a.type === 'expense' || a.type === 'cost_of_sales' || a.type === 'asset').map(acc => (
                            <SelectItem key={acc.code} value={acc.code}>
                              {acc.code} - {acc.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Help the bookkeeper categorize this.</FormDescription>
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Receipt Photos</FormLabel>
                  <div className="mt-1.5 space-y-3">
                    {pendingFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {pendingFiles.map((pf, i) => (
                          <div key={i} className="relative group flex items-center gap-1.5 bg-muted/40 border border-border rounded-md px-2 py-1.5 text-xs max-w-[160px]">
                            {pf.previewUrl ? (
                              <img src={pf.previewUrl} alt={pf.file.name} className="w-8 h-8 object-cover rounded shrink-0" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-muted-foreground shrink-0" />
                            )}
                            <span className="truncate text-foreground">{pf.file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile(i)}
                              className="ml-auto shrink-0 text-muted-foreground hover:text-destructive"
                            >
                              <XIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <label className="flex items-center gap-2 cursor-pointer bg-background border border-dashed border-border rounded-md px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted/30 hover:border-primary/40 transition-colors">
                      <Paperclip className="w-4 h-4 shrink-0" />
                      <span>{pendingFiles.length === 0 ? "Attach receipt photos" : "Add more photos"}</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        multiple
                        capture="environment"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="text-xs text-muted-foreground">Take a photo with your camera or choose from your gallery. JPG, PNG, PDF accepted.</p>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Any context the bookkeeper should know..." className="resize-none h-20" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto px-8">
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  {isSubmitting && pendingFiles.length > 0 ? "Uploading photos…" : "Submit Receipt"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-serif font-bold text-foreground border-b border-border pb-2">Your Submissions</h2>
        
        <div className="border border-border rounded-md overflow-hidden bg-card shadow-sm">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingList ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mx-auto" />
                  </TableCell>
                </TableRow>
              ) : !page || page.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    You haven't submitted any receipts yet.
                  </TableCell>
                </TableRow>
              ) : (
                page?.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      {format(new Date(sub.occurredOn), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{sub.vendor}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[250px]">{sub.description}</div>
                      {sub.attachments && sub.attachments.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Paperclip className="w-3 h-3" />
                          {sub.attachments.length} photo{sub.attachments.length !== 1 ? "s" : ""}
                        </div>
                      )}
                      {sub.status === 'rejected' && sub.rejectedReason && (
                        <div className="text-xs text-destructive mt-1 flex items-start gap-1 bg-destructive/10 p-1.5 rounded">
                          <Info className="w-3 h-3 shrink-0 mt-0.5" />
                          <span>{sub.rejectedReason}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(sub.status)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(sub.amount)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
