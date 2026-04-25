import { useState } from "react";
import { Link } from "wouter";
import { 
  useListCostCentres, 
  useCreateCostCentre,
  getListCostCentresQueryKey,
  useGetBookkeeperMe
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
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
import { Loader2, Plus, LineChart } from "lucide-react";
import { toast } from "sonner";

const ccSchema = z.object({
  code: z.string().min(1, "Code required"),
  name: z.string().min(1, "Name required"),
  parentEntity: z.string().min(1, "Parent required"),
  owner: z.string().optional(),
  description: z.string().optional(),
});

export default function CostCentres() {
  const queryClient = useQueryClient();
  const { data: me } = useGetBookkeeperMe();
  const { data: page, isLoading } = useListCostCentres();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const createCc = useCreateCostCentre();

  const form = useForm<z.infer<typeof ccSchema>>({
    resolver: zodResolver(ccSchema),
    defaultValues: {
      code: "",
      name: "",
      parentEntity: "Headwaters",
    }
  });

  const onSubmit = (values: z.infer<typeof ccSchema>) => {
    createCc.mutate({
      data: {
        ...values,
        owner: values.owner || undefined,
        description: values.description || undefined
      }
    }, {
      onSuccess: () => {
        toast.success("Cost Centre created");
        setIsCreateOpen(false);
        form.reset();
        queryClient.invalidateQueries({ queryKey: getListCostCentresQueryKey() });
      },
      onError: (err: Error) => {
        toast.error(err.message || "Failed to create cost centre");
      }
    });
  };

  const isOwner = me?.role === "owner";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Cost Centres</h1>
          <p className="text-muted-foreground mt-1">Agency tracking divisions and reporting units.</p>
        </div>
        {isOwner && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button data-testid="action-new-cost-centre">
                <Plus className="w-4 h-4 mr-2" />
                New Cost Centre
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Cost Centre</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. SALT-01" {...field} />
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
                            <Input placeholder="e.g. Salt Checkout" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="parentEntity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent Entity</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Headwaters" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="owner"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Owner (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Bookkeeper" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Purpose of this cost centre..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={createCc.isPending}>
                      {createCc.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Create
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="border border-border rounded-md overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Parent Entity</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mx-auto" />
                </TableCell>
              </TableRow>
            ) : !page || page.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No cost centres found.
                </TableCell>
              </TableRow>
            ) : (
              page?.map((cc) => (
                <TableRow key={cc.id}>
                  <TableCell className="font-mono font-medium">
                    <Badge variant={cc.isActive ? "outline" : "secondary"}>{cc.code}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{cc.name}</div>
                    {cc.description && <div className="text-xs text-muted-foreground mt-0.5">{cc.description}</div>}
                  </TableCell>
                  <TableCell>{cc.parentEntity}</TableCell>
                  <TableCell className="text-muted-foreground">{cc.owner || '-'}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/cost-centres/${cc.code}/pnl`}>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                        <LineChart className="w-4 h-4 mr-2" />
                        View P&L
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
