import { useGetBookkeeperDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Receipt, Inbox, Building2, BookOpen } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: dashboard, isLoading } = useGetBookkeeperDashboard();

  if (isLoading || !dashboard) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(val);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of agency ledger activity.</p>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
            <Receipt className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.totals.transactions}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboard.totals.postedThisMonth} posted this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Submissions</CardTitle>
            <Inbox className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.totals.pendingSubmissionsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Requiring review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cost Centres</CardTitle>
            <Building2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.totals.costCentres}</div>
            <p className="text-xs text-muted-foreground mt-1">Active cost centres</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Accounts</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.totals.accounts}</div>
            <p className="text-xs text-muted-foreground mt-1">In chart of accounts</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cost Centre Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cost Centre Summary</CardTitle>
            <CardDescription>Revenue and costs by entity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboard.byCostCentre.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No cost centre data available.</p>
              ) : (
                dashboard.byCostCentre.map(cc => (
                  <div key={cc.code} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium">{cc.name}</div>
                      <div className="text-xs text-muted-foreground">{cc.code}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${cc.net >= 0 ? 'text-primary' : 'text-destructive'}`}>
                        {formatCurrency(cc.net)}
                      </div>
                      <div className="text-xs text-muted-foreground flex gap-3 mt-1">
                        <span>Rev: {formatCurrency(cc.revenue)}</span>
                        <span>Cost: {formatCurrency(cc.costs)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboard.recentTransactions.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No recent transactions.</p>
              ) : (
                dashboard.recentTransactions.slice(0, 5).map(txn => (
                  <div key={txn.id} className="flex items-start justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="min-w-0 pr-4">
                      <div className="font-medium text-sm truncate">{txn.description}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {format(new Date(txn.postedDate), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <div className="text-sm font-medium whitespace-nowrap">
                      {formatCurrency(txn.totalDebit)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
