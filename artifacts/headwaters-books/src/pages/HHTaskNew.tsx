import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateHhTask, useGetHhBand, getGetHhTasksQueryKey, getGetHhDashboardQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Loader2, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(1, "Give the task a name"),
  description: z.string().min(1, "Describe what needs to be done"),
  estimatedMinutes: z.coerce.number().int().min(5, "At least 5 minutes"),
  payAmount: z.string().min(1, "Set the pay"),
  payCurrency: z.enum(["token", "xrp"]),
  availableDate: z.string().min(1, "Pick a date"),
});

type FormData = z.infer<typeof schema>;

export default function HHTaskNew() {
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const { data: band } = useGetHhBand();
  const createTask = useCreateHhTask();

  const today = new Date().toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      payCurrency: (band?.defaultPayCurrency as "token" | "xrp") ?? "token",
      availableDate: today,
      estimatedMinutes: 60,
    },
  });

  const payCurrency = watch("payCurrency");
  const tokenCode = band?.communityTokenCode ?? "HWBAND";

  function onSubmit(data: FormData) {
    createTask.mutate(
      { data: { ...data, estimatedMinutes: Number(data.estimatedMinutes) } },
      {
        onSuccess: () => {
          toast.success("Task posted — pay is now locked in secure hold");
          qc.invalidateQueries({ queryKey: getGetHhTasksQueryKey() });
          qc.invalidateQueries({ queryKey: getGetHhDashboardQueryKey() });
          setLocation("/helping-hands/tasks");
        },
        onError: (e: Error) => toast.error(e.message || "Could not post task"),
      },
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center gap-3">
        <button onClick={() => setLocation("/helping-hands/tasks")} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Post a task</h1>
          <p className="text-muted-foreground mt-1 text-sm">Pay is locked automatically when you post.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="title">Task name</Label>
          <Input id="title" placeholder="e.g. Clear the trail between fire road and camp" {...register("title")} />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">What needs to be done</Label>
          <Textarea
            id="description"
            rows={4}
            placeholder="Be specific — members should know exactly what to do without needing to ask."
            {...register("description")}
          />
          {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="estimatedMinutes">How long it should take</Label>
          <div className="flex items-center gap-2">
            <Input
              id="estimatedMinutes"
              type="number"
              min={5}
              step={5}
              className="w-28"
              {...register("estimatedMinutes")}
            />
            <span className="text-sm text-muted-foreground">minutes</span>
          </div>
          {errors.estimatedMinutes && <p className="text-sm text-destructive">{errors.estimatedMinutes.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="availableDate">Task date</Label>
          <Input id="availableDate" type="date" {...register("availableDate")} />
          {errors.availableDate && <p className="text-sm text-destructive">{errors.availableDate.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Pay</Label>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              min={0}
              step={0.01}
              placeholder="0.00"
              className="w-32"
              {...register("payAmount")}
            />
            <select
              className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              {...register("payCurrency")}
            >
              <option value="token">{tokenCode} (community token)</option>
              <option value="xrp">XRP</option>
            </select>
          </div>
          {errors.payAmount && <p className="text-sm text-destructive">{errors.payAmount.message}</p>}
        </div>

        {/* Escrow notice */}
        <div className="flex gap-3 bg-muted/40 border border-border rounded-lg p-4 text-sm text-muted-foreground">
          <Lock className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
          <span>
            When you post this task, the pay amount is locked in a secure XRPL escrow.
            No one can touch it until you confirm the task is done — then it goes straight to the member's wallet.
          </span>
        </div>

        <Button type="submit" disabled={createTask.isPending} className="w-full">
          {createTask.isPending ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Locking pay & posting…</>
          ) : (
            "Post task & lock pay"
          )}
        </Button>
      </form>
    </div>
  );
}
