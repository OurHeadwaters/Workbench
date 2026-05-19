import { useState, useEffect, useCallback } from "react";
import { api, type SandboxHousehold, type SandboxStandbyEvent, type SandboxRole, type SandboxCheckinSummary } from "@/lib/api";
import { Shield, CheckCircle, Circle, Users, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface StandbyPageProps {
  household: SandboxHousehold;
}

export function StandbyPage({ household }: StandbyPageProps) {
  const [standby, setStandby] = useState<SandboxStandbyEvent | null>(null);
  const [roles, setRoles] = useState<SandboxRole[]>([]);
  const [checkins, setCheckins] = useState<SandboxCheckinSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ev, r] = await Promise.all([api.getActiveStandby(), api.listRoles()]);
      setStandby(ev);
      setRoles(r);
      if (ev) {
        const ci = await api.listCheckins();
        setCheckins(ci);
        setCheckedIn(ci.checkins.some((c) => c.householdId === household.id));
      }
    } finally {
      setLoading(false);
    }
  }, [household.id]);

  useEffect(() => { load(); }, [load]);

  async function handleCheckin() {
    try {
      await api.checkin();
      setCheckedIn(true);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not check in");
    }
  }

  const publicRoles = roles.filter((r) => r.householdId && r.isPublic);
  const myRole = roles.find((r) => r.householdId === household.id);

  if (loading) {
    return (
      <div className="min-h-dvh bg-[#FAF6F0] flex items-center justify-center">
        <p className="text-[#7A6B60] text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#FAF6F0]">
      <header className="sticky top-0 bg-[#FAF6F0] border-b border-[#E4D9CC] px-4 py-4 pt-safe-top z-10">
        <div className="flex items-center gap-3">
          <Shield className={`w-5 h-5 ${standby ? "text-[#C7613B]" : "text-[#7A6B60]"}`} />
          <div>
            <h1 className="text-xl text-[#2E2620]">Standby</h1>
            <p className="text-xs text-[#7A6B60]">
              {standby ? "Event in progress" : "No active event"}
            </p>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {standby ? (
          <>
            <div className="bg-[#F5EAE4] rounded-2xl border border-[#C7613B] p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#C7613B] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h2 className="font-medium text-[#2E2620] text-sm">{standby.name}</h2>
                  <p className="text-xs text-[#7A6B60] mt-0.5">
                    Declared by {standby.declaredByName} — {formatDistanceToNow(new Date(standby.declaredAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              {!checkedIn ? (
                <button
                  onClick={handleCheckin}
                  className="mt-4 w-full bg-[#4A6741] text-white py-3.5 rounded-xl text-sm font-medium active:scale-95 transition-all min-h-[48px] flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  We are okay — check in
                </button>
              ) : (
                <div className="mt-4 flex items-center gap-2 text-[#4A6741] bg-[#FFFDF9] rounded-xl px-4 py-3 border border-[#4A6741]/30">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Checked in</span>
                </div>
              )}

              {error && <p className="text-xs text-[#C7613B] mt-2">{error}</p>}
            </div>

            {checkins && household.isOrganizer && (
              <div className="bg-[#FFFDF9] rounded-2xl border border-[#E4D9CC] p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-[#2E2620]">Check-in status</h3>
                  <span className="text-xs text-[#7A6B60] bg-[#F0E9DF] px-2 py-1 rounded-full">
                    {checkins.checkedIn} / {checkins.total}
                  </span>
                </div>

                {checkins.remaining.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-[#C7613B] mb-2 uppercase tracking-wide">
                      Not yet checked in ({checkins.remaining.length})
                    </p>
                    <div className="space-y-1.5">
                      {checkins.remaining.map((h) => (
                        <div key={h.id} className="flex items-center gap-2">
                          <Circle className="w-3.5 h-3.5 text-[#C7613B]/40 flex-shrink-0" />
                          <span className="text-sm text-[#7A6B60]">{h.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {checkins.checkins.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-[#4A6741] mb-2 uppercase tracking-wide">
                      Checked in
                    </p>
                    <div className="space-y-2">
                      {checkins.checkins.map((c) => (
                        <div key={c.householdId} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-[#4A6741]" />
                          <span className="text-sm text-[#4A3F38]">{c.householdName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="bg-[#FFFDF9] rounded-2xl border border-[#E4D9CC] p-6 text-center">
            <Shield className="w-8 h-8 text-[#E4D9CC] mx-auto mb-3" />
            <p className="text-sm text-[#7A6B60]">No standby event active.</p>
            <p className="text-xs text-[#7A6B60] mt-1">
              Your organizer will declare a standby if the neighbourhood needs to mobilise.
            </p>
          </div>
        )}

        {publicRoles.length > 0 && (
          <div className="bg-[#FFFDF9] rounded-2xl border border-[#E4D9CC] p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-[#4A6741]" />
              <h3 className="text-sm font-medium text-[#2E2620]">
                {standby ? "Who has what" : "Neighbourhood roles"}
              </h3>
            </div>
            <div className="space-y-3">
              {publicRoles.map((role) => (
                <div key={role.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#EBF2EA] flex items-center justify-center text-xs font-medium text-[#4A6741] flex-shrink-0">
                    {role.householdName?.slice(0, 2).toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#2E2620]">{role.roleName}</p>
                    <p className="text-xs text-[#7A6B60]">{role.householdName}</p>
                    {role.description && (
                      <p className="text-xs text-[#7A6B60] mt-0.5">{role.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {myRole && !myRole.isPublic && (
          <div className="bg-[#EBF2EA] rounded-xl border border-[#4A6741]/30 p-4">
            <p className="text-xs font-medium text-[#4A6741] uppercase tracking-wide mb-1">
              Your assigned role
            </p>
            <p className="text-sm font-medium text-[#2E2620]">{myRole.roleName}</p>
            {myRole.description && <p className="text-xs text-[#7A6B60] mt-1">{myRole.description}</p>}
            <p className="text-xs text-[#7A6B60] mt-2">
              Not yet visible to the neighbourhood. Ask your organizer about consent.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
