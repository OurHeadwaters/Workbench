import { Link } from "wouter";
import { useGetLibraryStats, useGetRecentActivity } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, FileText, Users, FolderOpen, Tag, ArrowRight, UploadCloud, EyeOff, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EntryCard } from "@/components/EntryCard";
import { PHENOMENA } from "@workspace/why-stores-fail";

export default function Home() {
  const { data: stats, isLoading } = useGetLibraryStats();
  const { data: recentActivity, isLoading: recentLoading } = useGetRecentActivity({ limit: 6 });

  if (isLoading || recentLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <h1 className="text-3xl font-serif font-bold">Library Overview</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="relative">
          <div aria-hidden className="pointer-events-none absolute -inset-6 od-topo" style={{ opacity: 0.08 }} />
          <div className="hw-label mb-3">Northern Food Systems Research Library</div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2">Library Overview</h1>
          <p className="text-muted-foreground text-lg">
            Northern Food Systems Research
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/entries/new">
            <Button className="gap-2">
              <UploadCloud className="h-4 w-4" />
              Add Entry
            </Button>
          </Link>
          {stats.needsReviewCount > 0 && (
            <Link href="/needs-review">
              <Button variant="secondary" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                Review Queue ({stats.needsReviewCount})
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Entries" value={stats.totalEntries} icon={FileText} href="/entries" />
        <StatCard title="Producers" value={stats.totalProducers} icon={Users} href="/producers" />
        <StatCard title="Project Buckets" value={stats.totalBuckets} icon={FolderOpen} href="/buckets" />
        <StatCard title="Subjects" value={stats.totalSubjects} icon={Tag} href="/subjects" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Link href="/why-stores-fail">
          <Card className="hover-elevate cursor-pointer transition-all border-secondary/40 bg-gradient-to-br from-secondary/5 to-accent/5 hover:border-secondary group h-full">
            <CardContent className="p-6 flex items-start gap-5">
              <div className="rounded-xl bg-secondary/10 text-secondary p-3 shrink-0">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold mb-1">
                  Synthesis · drawn from the library
                </div>
                <CardTitle className="text-xl font-serif text-primary group-hover:text-secondary transition-colors mb-2">
                  Why Northern Stores Fail
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  A named catalog of every failure mode in the current
                  northern-store model — with the evidence and the source it came
                  from. Same dataset the community store analysis reads from.
                </CardDescription>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0 mt-1" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/phenomena">
          <Card
            className="hover-elevate cursor-pointer transition-all border-accent/40 bg-gradient-to-br from-accent/5 to-secondary/5 hover:border-accent group h-full"
            data-testid="home-phenomena-card"
          >
            <CardContent className="p-6 flex items-start gap-5">
              <div className="rounded-xl bg-accent/10 text-accent p-3 shrink-0">
                <EyeOff className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold mb-1">
                  Cross-industry · the link is the finding
                </div>
                <CardTitle className="text-xl font-serif text-primary group-hover:text-accent transition-colors mb-2">
                  <span
                    className="font-serif font-bold text-accent"
                    data-testid="home-phenomena-count"
                  >
                    {PHENOMENA.length}
                  </span>{" "}
                  phenomena nobody owns
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Headline numbers from Transport Canada, federal program
                  audits, academic researchers, and the community turn out to
                  describe one structural object. The link itself is the
                  finding.
                </CardDescription>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0 mt-1" />
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="hw-label mb-1">Recent Additions</div>
              <h2 className="text-2xl font-serif font-semibold text-primary sr-only">Recent Additions</h2>
            </div>
            <Link href="/entries">
              <Button variant="link" className="text-secondary gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentActivity?.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
            {(!recentActivity || recentActivity.length === 0) && (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-xl bg-card">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                <p className="text-muted-foreground">The library is empty. Let's add some research.</p>
                <Link href="/entries/new">
                  <Button variant="outline" className="mt-4">Upload a file</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <Card className="bg-card/50 border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-serif">Top Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topSubjects.map(subject => (
                  <Link key={subject.slug} href={`/entries?subjectSlug=${subject.slug}`}>
                    <div className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: subject.color || 'hsl(var(--muted))' }} 
                        />
                        <span className="font-medium text-foreground group-hover:text-secondary transition-colors">{subject.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{subject.count}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-serif">Project Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.bucketBreakdown.map(bucket => (
                  <Link key={bucket.slug} href={`/entries?bucketSlug=${bucket.slug}`}>
                    <div className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4 text-muted-foreground group-hover:text-secondary transition-colors" />
                        <span className="font-medium text-foreground group-hover:text-secondary transition-colors">{bucket.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{bucket.count}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, href }: { title: string, value: number, icon: LucideIcon, href: string }) {
  return (
    <Link href={href}>
      <Card className="hover-elevate cursor-pointer transition-all border-border shadow-sm bg-card hover:border-secondary/50 group">
        <CardContent className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Icon className="h-5 w-5 text-muted-foreground group-hover:text-secondary transition-colors" />
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </div>
          <div>
            <p className="text-3xl font-serif font-bold text-foreground mb-1">{value}</p>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
