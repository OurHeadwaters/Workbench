import { Router, type IRouter } from "express";
import { db, subcontractSubmissionTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

function readStr(body: Record<string, unknown>, key: string, maxLen: number): string | null {
  const v = body[key];
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  if (trimmed.length === 0) return null;
  return trimmed.slice(0, maxLen);
}

function readNum(body: Record<string, unknown>, key: string): string | null {
  const v = body[key];
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  if (isNaN(n) || n < 0) return null;
  return n.toFixed(2);
}

router.post("/subcontract/submit", async (req, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>;

  const project = readStr(body, "project", 100) ?? "cold-trailer";
  const submittedBy = readStr(body, "submittedBy", 200);
  const workDate = readStr(body, "workDate", 20);
  const scopeItem = readStr(body, "scopeItem", 200);
  const description = readStr(body, "description", 2000);
  const hours = readNum(body, "hours");
  const ratePerHour = readNum(body, "ratePerHour");
  const expenseDescription = readStr(body, "expenseDescription", 500);
  const expenseAmount = readNum(body, "expenseAmount");

  if (!submittedBy) { res.status(422).json({ error: "Name is required." }); return; }
  if (!workDate) { res.status(422).json({ error: "Date is required." }); return; }
  if (!scopeItem) { res.status(422).json({ error: "Scope item is required." }); return; }
  if (!description) { res.status(422).json({ error: "Description is required." }); return; }
  if (!hours && !expenseAmount) {
    res.status(422).json({ error: "Enter either hours worked or an expense amount (or both)." });
    return;
  }
  if (hours && !ratePerHour) {
    res.status(422).json({ error: "Enter your hourly rate." });
    return;
  }

  const [row] = await db
    .insert(subcontractSubmissionTable)
    .values({ project, submittedBy, workDate, scopeItem, description, hours, ratePerHour, expenseDescription, expenseAmount })
    .returning();

  res.status(201).json({ ok: true, id: row!.id });
});

router.get("/subcontract/submissions/:project", async (req, res) => {
  const project = req.params.project?.slice(0, 100);
  if (!project) { res.status(400).json({ error: "Project required." }); return; }

  const rows = await db
    .select()
    .from(subcontractSubmissionTable)
    .where(eq(subcontractSubmissionTable.project, project))
    .orderBy(desc(subcontractSubmissionTable.workDate));

  const totalLabour = rows.reduce((sum, r) => {
    if (!r.hours || !r.ratePerHour) return sum;
    return sum + parseFloat(r.hours) * parseFloat(r.ratePerHour);
  }, 0);

  const totalExpenses = rows.reduce((sum, r) => {
    if (!r.expenseAmount) return sum;
    return sum + parseFloat(r.expenseAmount);
  }, 0);

  res.json({ rows, totalLabour, totalExpenses, totalSpent: totalLabour + totalExpenses });
});

export default router;
