import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { 
  useListAccounts, 
  useListCostCentres, 
  useCreateTransaction,
  getListTransactionsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const lineSchema = z.object({
  accountCode: z.string().min(1, "Account required"),
  costCentreCode: z.string().optional(),
  memo: z.string().optional(),
  debit: z.coerce.number().min(0).default(0),
  credit: z.coerce.number().min(0).default(0)
}).refine(data => (data.debit > 0 && data.credit === 0) || (data.credit > 0 && data.debit === 0) || (data.debit === 0 && data.credit === 0), {
  message: "Line must be either debit or credit, not both",
  path: ["debit"]
});

const formSchema = z.object({
  postedDate: z.string().min(1, "Date required"),
  description: z.string().min(1, "Description required"),
  reference: z.string().optional(),
  lines: z.array(lineSchema).min(2, "At least 2 lines required")
});

export default function TransactionNew() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const { data: accountsData } = useListAccounts();
  const { data: costCentresData } = useListCostCentres();
  
  const createTxn = useCreateTransaction();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postedDate: format(new Date(), "yyyy-MM-dd"),
      description: "",
      reference: "",
      lines: [
        { accountCode: "", debit: 0, credit: 0 },
        { accountCode: "", debit: 0, credit: 0 }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines"
  });

  const watchLines = form.watch("lines");
  
  const { totalDebit, totalCredit, isBalanced, validLines } = useMemo(() => {
    let debits = 0;
    let credits = 0;
    let validCount = 0;
    
    watchLines.forEach(line => {
      const d = Number(line.debit) || 0;
      const c = Number(line.credit) || 0;
      debits += d;
      credits += c;
      if (d > 0 || c > 0) validCount++;
    });

    return {
      totalDebit: debits,
      totalCredit: credits,
      isBalanced: debits > 0 && debits === credits,
      validLines: validCount
    };
  }, [watchLines]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(val);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!isBalanced) {
      toast.error("Transaction is not balanced.");
      return;
    }
    if (validLines < 2) {
      toast.error("At least two lines with amounts are required.");
      return;
    }

    createTxn.mutate({
      data: {
        postedDate: values.postedDate,
        description: values.description,
        reference: values.reference || undefined,
        lines: values.lines.filter(l => l.debit > 0 || l.credit > 0).map(l => ({
          accountCode: l.accountCode,
          costCentreCode: l.costCentreCode || undefined,
          memo: l.memo || undefined,
          debit: Number(l.debit) || 0,
          credit: Number(l.credit) || 0
        }))
      }
    }, {
      onSuccess: () => {
        toast.success("Transaction posted successfully");
        queryClient.invalidateQueries({ queryKey: getListTransactionsQueryKey() });
        setLocation("/transactions");
      },
      onError: (err: Error) => {
        toast.error(err.message || "Failed to post transaction");
      }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/transactions">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">New Journal Entry</h1>
          <p className="text-muted-foreground text-sm">Post a manual transaction to the ledger.</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Header</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="postedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} data-testid="input-date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Monthly Rent" {...field} data-testid="input-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Invoice / Receipt #" {...field} data-testid="input-reference" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Lines</CardTitle>
              <div className="text-sm font-mono bg-muted px-3 py-1 rounded-md flex gap-4">
                <span className={totalDebit !== totalCredit ? 'text-destructive' : ''}>
                  Debits: {formatCurrency(totalDebit)}
                </span>
                <span className={totalDebit !== totalCredit ? 'text-destructive' : ''}>
                  Credits: {formatCurrency(totalCredit)}
                </span>
                <span className={totalDebit !== totalCredit ? 'text-destructive font-bold' : 'text-primary font-bold'}>
                  Δ: {formatCurrency(Math.abs(totalDebit - totalCredit))}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="hidden md:grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-1">
                <div className="col-span-4">Account</div>
                <div className="col-span-2">Cost Centre</div>
                <div className="col-span-3">Memo</div>
                <div className="col-span-1 text-right">Debit</div>
                <div className="col-span-1 text-right">Credit</div>
                <div className="col-span-1"></div>
              </div>
              
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start bg-muted/20 p-2 md:p-1 md:bg-transparent rounded-md border border-border md:border-none">
                    <div className="col-span-1 md:col-span-4">
                      <FormField
                        control={form.control}
                        name={`lines.${index}.accountCode`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="md:hidden text-xs text-muted-foreground mb-1">Account</div>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid={`select-account-${index}`}>
                                  <SelectValue placeholder="Select account" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {accountsData?.map(acc => (
                                  <SelectItem key={acc.code} value={acc.code}>
                                    {acc.code} - {acc.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <FormField
                        control={form.control}
                        name={`lines.${index}.costCentreCode`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="md:hidden text-xs text-muted-foreground mb-1">Cost Centre</div>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="None" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="">None</SelectItem>
                                {costCentresData?.map(cc => (
                                  <SelectItem key={cc.code} value={cc.code}>
                                    {cc.code}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-1 md:col-span-3">
                      <FormField
                        control={form.control}
                        name={`lines.${index}.memo`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="md:hidden text-xs text-muted-foreground mb-1">Memo</div>
                            <FormControl>
                              <Input placeholder="Memo..." {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-1 grid grid-cols-2 md:grid-cols-2 md:col-span-2 gap-2">
                      <FormField
                        control={form.control}
                        name={`lines.${index}.debit`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="md:hidden text-xs text-muted-foreground mb-1">Debit</div>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01" 
                                className="text-right text-sm" 
                                {...field}
                                value={field.value || ''}
                                onChange={e => {
                                  field.onChange(e);
                                  if (Number(e.target.value) > 0) {
                                    form.setValue(`lines.${index}.credit`, 0);
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`lines.${index}.credit`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="md:hidden text-xs text-muted-foreground mb-1">Credit</div>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01" 
                                className="text-right text-sm" 
                                {...field}
                                value={field.value || ''}
                                onChange={e => {
                                  field.onChange(e);
                                  if (Number(e.target.value) > 0) {
                                    form.setValue(`lines.${index}.debit`, 0);
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-1 flex items-end justify-end md:justify-center md:pt-1">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 2}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ accountCode: "", debit: 0, credit: 0 })}
                  data-testid="action-add-line"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Line
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Link href="/transactions">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button 
              type="submit" 
              disabled={createTxn.isPending || !isBalanced || validLines < 2}
              data-testid="action-submit-transaction"
            >
              {createTxn.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Post Transaction
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
