import { 
  useGetHandlerActivity, 
  useNudgeHandler,
  getGetHandlerActivityQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Bell, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function Handlers() {
  const queryClient = useQueryClient();
  
  const { data: handlers, isLoading } = useGetHandlerActivity();
  const nudgeHandler = useNudgeHandler();

  const handleNudge = (userId: string, name: string) => {
    nudgeHandler.mutate({
      id: userId,
      data: { message: "Please submit your pending receipts for the month." }
    }, {
      onSuccess: () => {
        toast.success(`Reminder sent to ${name}`);
        queryClient.invalidateQueries({ queryKey: getGetHandlerActivityQueryKey() });
      },
      onError: (err: Error) => {
        toast.error(err.message || "Failed to send reminder");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Food Handlers</h1>
          <p className="text-muted-foreground mt-1">Monitor receipt submissions and compliance across the team.</p>
        </div>
      </div>

      <div className="border border-border rounded-md overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff Member</TableHead>
              <TableHead className="text-center">Total Submissions</TableHead>
              <TableHead className="text-center">Pending Review</TableHead>
              <TableHead>Last Submission</TableHead>
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
            ) : !handlers || handlers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No food handlers found.
                </TableCell>
              </TableRow>
            ) : (
              handlers.map((handler) => {
                const name = handler.firstName ? `${handler.firstName} ${handler.lastName || ''}` : handler.email;
                const isStale = (handler.daysSinceLastSubmission || 0) >= 14;
                
                return (
                  <TableRow key={handler.userId} className={isStale ? "bg-destructive/5" : ""}>
                    <TableCell>
                      <div className="font-medium flex items-center gap-2">
                        {name}
                        {isStale && <AlertCircle className="w-4 h-4 text-destructive" />}
                      </div>
                      <div className="text-xs text-muted-foreground">{handler.email}</div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {handler.totalSubmissions}
                    </TableCell>
                    <TableCell className="text-center">
                      {handler.pendingSubmissions > 0 ? (
                        <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
                          {handler.pendingSubmissions}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {handler.lastSubmissionAt ? (
                        <div>
                          <div className={`font-medium ${isStale ? 'text-destructive' : ''}`}>
                            {handler.daysSinceLastSubmission} days ago
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(handler.lastSubmissionAt), 'MMM d, yyyy')}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Never</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={nudgeHandler.isPending && nudgeHandler.variables?.id === handler.userId}
                        onClick={() => handleNudge(handler.userId, name)}
                      >
                        {nudgeHandler.isPending && nudgeHandler.variables?.id === handler.userId ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Bell className="w-4 h-4 mr-2" />
                        )}
                        Send Reminder
                      </Button>
                      {handler.lastNudgedAt && (
                        <div className="text-[10px] text-muted-foreground mt-1 text-right">
                          Last: {format(new Date(handler.lastNudgedAt), 'MMM d')}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
