import { useState } from "react";
import { 
  useListAccounts, 
  useCreateAccount,
  useUpdateAccount,
  getListAccountsQueryKey,
  useGetBookkeeperMe
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { AccountType, AccountNormalSide, TaxCode } from "@workspace/api-client-react";

const TAX_CODE_LABELS: Record<string, string> = {
  "gst-collected": "GST Collected",
  "gst-paid": "GST Paid (ITC)",
  "exempt": "Exempt",
  "zero-rated": "Zero-Rated",
  "personal": "Personal",
  "none": "None",
};

const accountSchema = z.object({
  code: z.string().min(1, "Code required"),
  name: z.string().min(1, "Name required"),
  type: z.nativeEnum(AccountType),
  normalSide: z.nativeEnum(AccountNormalSide),
  costCentreCode: z.string().optional(),
  mirrorAccountCode: z.string().optional(),
  notes: z.string().optional(),
  taxCode: z.nativeEnum(TaxCode).optional(),
});

export default function Accounts() {
  const queryClient = useQueryClient();
  const { data: me } = useGetBookkeeperMe();
  const { data: page, isLoading } = useListAccounts();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const createAccount = useCreateAccount();

  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      code: "",
      name: "",
      type: "expense",
      normalSide: "debit",
      taxCode: "none",
    }
  });

  const onSubmit = (values: z.infer<typeof accountSchema>) => {
    createAccount.mutate({
      data: {
        ...values,
        costCentreCode: values.costCentreCode || undefined,
        mirrorAccountCode: values.mirrorAccountCode || undefined,
        notes: values.notes || undefined,
        taxCode: values.taxCode || undefined,
      }
    }, {
      onSuccess: () => {
        toast.success("Account created");
        setIsCreateOpen(false);
        form.reset();
        queryClient.invalidateQueries({ queryKey: getListAccountsQueryKey() });
      },
      onError: (err: Error) => {
        toast.error(err.message || "Failed to create account");
      }
    });
  };

  const isOwner = me?.role === "owner";

  const accountsList = page ?? [];
  const groupedAccounts = accountsList.reduce((acc, account) => {
    if (!acc[account.type]) acc[account.type] = [];
    acc[account.type].push(account);
    return acc;
  }, {} as Record<string, typeof accountsList>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Chart of Accounts</h1>
          <p className="text-muted-foreground mt-1">The structured list of all ledger accounts.</p>
        </div>
        {isOwner && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button data-testid="action-new-account">
                <Plus className="w-4 h-4 mr-2" />
                New Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Account</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Code</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 5400" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Travel & Meals" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
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
                              {Object.values(AccountType).map(t => (
                                <SelectItem key={t} value={t} className="capitalize">{t.replace('_', ' ')}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="normalSide"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Normal Side</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select side" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="debit">Debit</SelectItem>
                              <SelectItem value="credit">Credit</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="taxCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GST/HST Tax Code</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value ?? "none"}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select tax code" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(TaxCode).map(tc => (
                                <SelectItem key={tc} value={tc}>
                                  {TAX_CODE_LABELS[tc] ?? tc}
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
                      name="costCentreCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost Centre (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. SALT-01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={createAccount.isPending}>
                      {createAccount.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Create Account
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : Object.keys(groupedAccounts).length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No accounts configured.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedAccounts).map(([type, accounts]) => (
            <div key={type} className="space-y-3">
              <h2 className="text-lg font-semibold capitalize text-foreground flex items-center gap-2">
                {type.replace('_', ' ')}
                <Badge variant="secondary" className="text-xs">{accounts.length}</Badge>
              </h2>
              <div className="border border-border rounded-md overflow-hidden bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Side</TableHead>
                      <TableHead>Tax Code</TableHead>
                      <TableHead>Cost Centre</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map(acc => (
                      <TableRow key={acc.id}>
                        <TableCell className="font-mono font-medium">{acc.code}</TableCell>
                        <TableCell>{acc.name}</TableCell>
                        <TableCell className="capitalize text-muted-foreground text-sm">{acc.normalSide}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs font-mono">
                            {TAX_CODE_LABELS[acc.taxCode] ?? acc.taxCode}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {acc.costCentreCode ? (
                            <Badge variant="outline">{acc.costCentreCode}</Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={acc.isActive ? "default" : "secondary"} className={acc.isActive ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}>
                            {acc.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
