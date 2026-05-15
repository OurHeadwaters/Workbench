// ─── Types ───────────────────────────────────────────────────────────────────

export type Phase = "Foundation" | "Pilot Execution" | "Year-End Audit";

export type ActionType = "copy-ai-prompt" | "copy-replit-task-brief";

export interface StepAction {
  type: ActionType;
  label: string;
  content: string;
}

export interface Step {
  title: string;
  detail?: string;
  actions?: StepAction[];
}

export interface Day {
  isoDate: string;
  steps: Step[];
}

export interface Week {
  isoWeek: number;
  phase: Phase;
  theme: string;
  days: Day[]; // Mon–Fri
}

// ─── Data ────────────────────────────────────────────────────────────────────
// ISO Week 1 of 2026 starts Mon Dec 29, 2025.
// Week n Mon = Dec 29, 2025 + (n-1)*7 days.

export const PLAN_2026: Week[] = [

  // ══════════════════════════════════════════════════════════
  //  FOUNDATION  W1–W15  (Dec 29, 2025 – Apr 12, 2026)
  // ══════════════════════════════════════════════════════════

  {
    isoWeek: 1,
    phase: "Foundation",
    theme: "New-year contract review",
    days: [
      {
        isoDate: "2025-12-29",
        steps: [
          {
            title: "Re-read engagement terms cover to cover",
            detail: "Flag any ambiguous clauses — especially around deliverables, reporting cadence, and termination notice.",
          },
          {
            title: "Identify five open questions for band council legal",
            detail: "Focus on bridge capital draw conditions, invoice net-60 terms, and IP ownership of the data stack.",
            actions: [
              {
                type: "copy-ai-prompt",
                label: "Draft clarifying questions",
                content: "I am reviewing a community development services engagement contract with a First Nations band council in northern Ontario. The contract covers a 12-month engagement running a food store (Square POS, Local Line for producers, QuickBooks for books). I need to draft 5 precise legal clarifying questions about: (1) bridge capital draw conditions, (2) net-60 invoice enforcement, (3) IP ownership of the data infrastructure, (4) termination notice requirements, and (5) mid-year review triggers. Write the questions in plain language suitable for a non-lawyer council liaison.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2025-12-30",
        steps: [
          {
            title: "Review bridge capital trigger language",
            detail: "Confirm the draw schedule matches the two-month cost-basis model. Calendar the recovery milestones.",
          },
          {
            title: "Create shared Drive folder structure for the year",
            detail: "Folders: /Contracts, /Finance, /Operations, /Staff, /Council-Reports, /Tech.",
          },
        ],
      },
      {
        isoDate: "2025-12-31",
        steps: [
          {
            title: "Confirm engagement start date with band council liaison",
            detail: "Get written confirmation of Day 1 (target: Apr 13). Lock it into all calendars.",
          },
          {
            title: "Personal year-end review — set three Q1 objectives",
            detail: "Write them down: (1) hire OM, (2) sign Dryden lease, (3) stand up Square + Local Line.",
          },
        ],
      },
      {
        isoDate: "2026-01-01",
        steps: [
          { title: "New Year's Day — full rest", detail: "Protect family time. No operational decisions today." },
        ],
      },
      {
        isoDate: "2026-01-02",
        steps: [
          {
            title: "Draft Q1 timeline and milestone list",
            detail: "Map every Foundation-phase deliverable to a specific week. Share with OM candidate once hired.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 2,
    phase: "Foundation",
    theme: "Bridge capital transfer and banking setup",
    days: [
      {
        isoDate: "2026-01-05",
        steps: [
          {
            title: "Open Headwaters business chequing account",
            detail: "Dual-signatory required: practitioner + one council designate. Bring Articles of Incorporation.",
          },
          {
            title: "Confirm bridge capital transfer from council",
            detail: "Wire should arrive this week. Record as 'Bridge Capital Draw' in QuickBooks once received.",
          },
        ],
      },
      {
        isoDate: "2026-01-06",
        steps: [
          {
            title: "Set up payroll account with separate float",
            detail: "Keep payroll funds segregated. Confirm CRA payroll program number is active.",
          },
          {
            title: "Calendar all 12 invoice dates for the year",
            detail: "Net-60 means cash arrives two months after invoice. Mark cash-flow pinch points in red.",
          },
        ],
      },
      {
        isoDate: "2026-01-07",
        steps: [
          {
            title: "Draft wire instructions template for recurring payroll cycles",
            detail: "Give to bookkeeper once hired — reduces friction on every pay cycle.",
          },
        ],
      },
      {
        isoDate: "2026-01-08",
        steps: [
          {
            title: "Confirm first invoice schedule with band council finance office",
            detail: "Invoice #1 should go out on Day 1 of operations (Apr 13). Confirm the council AP contact.",
          },
        ],
      },
      {
        isoDate: "2026-01-09",
        steps: [
          {
            title: "Weekly review — bridge capital confirmed or escalate",
            detail: "If wire has not arrived by EOD, send formal written notice to council under contract clause.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 3,
    phase: "Foundation",
    theme: "Operations Manager hire",
    days: [
      {
        isoDate: "2026-01-12",
        steps: [
          {
            title: "Post OM job listing on Indeed and Dryden community boards",
            detail: "Role: ~40 hrs/wk, on-site in Dryden, $40/hr loaded. Bilingual (English/Anishinaabe) an asset.",
            actions: [
              {
                type: "copy-ai-prompt",
                label: "Write the OM job posting",
                content: "Write a job posting for an Operations Manager role at Headwaters Development Services, a community development agency operating a food store on behalf of a First Nations band council in northern Ontario (Deer Lake area). The role is ~40 hours/week, on-site in Dryden, ON, at $40/hr. Responsibilities include: daily store operations, Square POS oversight, Local Line producer ordering, staff coordination, and weekly reporting to the practitioner. Required: 3+ years ops experience, food handling cert or willingness to obtain, reliable transportation. Asset: knowledge of Indigenous food sovereignty, bilingual (English/Anishinaabe). Tone: warm, direct, community-minded.",
              },
            ],
          },
          {
            title: "Set up Applicant Tracking folder in Google Drive",
            detail: "Simple sheet: Candidate name, date applied, screening call date, status, notes.",
          },
        ],
      },
      {
        isoDate: "2026-01-13",
        steps: [
          {
            title: "Screen incoming résumés — shortlist 3 candidates",
            detail: "Non-negotiables: operations experience, availability by Feb 1, willing to be on-site in Dryden full time.",
          },
        ],
      },
      {
        isoDate: "2026-01-14",
        steps: [
          {
            title: "Phone screens with top 2 candidates (30 min each)",
            detail: "Ask: What does a good day look like? Walk me through a time you caught a process problem before it became a crisis.",
          },
        ],
      },
      {
        isoDate: "2026-01-15",
        steps: [
          {
            title: "Reference checks for preferred candidate",
            detail: "Two references: one must be a direct supervisor. Ask about reliability under pressure.",
          },
        ],
      },
      {
        isoDate: "2026-01-16",
        steps: [
          {
            title: "Send offer letter to selected OM candidate",
            detail: "Include start date, rate, reporting structure, and 3-month probation clause.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 4,
    phase: "Foundation",
    theme: "OM onboarding and Dryden orientation",
    days: [
      {
        isoDate: "2026-01-19",
        steps: [
          {
            title: "OM Day 1 — handbook walkthrough and intro call",
            detail: "Walk through the operating handbook, reporting cadence (weekly note to practitioner), and Q1 milestones.",
          },
          {
            title: "Set up OM on all tools: Drive, email, Slack",
            detail: "Give access to /Operations and /Finance folders. No payroll access yet.",
          },
        ],
      },
      {
        isoDate: "2026-01-20",
        steps: [
          {
            title: "Plan first Dryden site visit — schedule Dad-warehouse walk-through",
            detail: "Target: OM and practitioner visit together. Confirm the space is suitable before signing the lease.",
          },
        ],
      },
      {
        isoDate: "2026-01-21",
        steps: [
          {
            title: "OM first Dryden visit — warehouse and store space review",
            detail: "Document: square footage, loading dock access, refrigeration capacity, internet availability, parking.",
          },
        ],
      },
      {
        isoDate: "2026-01-22",
        steps: [
          {
            title: "OM meets band council liaison in Dryden",
            detail: "Introductory meeting. OM is the face of daily operations — relationship matters.",
          },
        ],
      },
      {
        isoDate: "2026-01-23",
        steps: [
          {
            title: "Post-visit debrief — site notes filed, open items listed",
            detail: "Top 3 questions to answer before signing the lease: refrigeration capacity, parking, load-in door width.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 5,
    phase: "Foundation",
    theme: "Tech stack procurement",
    days: [
      {
        isoDate: "2026-01-26",
        steps: [
          {
            title: "Finalise hardware list: 9 servers, 6 privacy phones, 8 computers",
            detail: "Servers: Ubuntu 22.04 LTS. Phones: GrapheneOS on Pixel 8. Computers: Refurbished ThinkPads, 16 GB RAM.",
          },
          {
            title: "Log expected hardware in the asset register",
            detail: "Asset register lives in Headwaters Books. Every item needs a serial number field for insurance.",
            actions: [
              {
                type: "copy-replit-task-brief",
                label: "Build the asset register in Headwaters Books",
                content: "In the Headwaters Books app, add an Asset Register section. It should list hardware items with: Item name, Category (Server / Phone / Computer / POS), Serial number (editable), Purchase date, Purchase price, Assigned location (Dryden store / Remote), and Status (Active / In Storage / Retired). Allow manual add/edit. Show a total replacement value at the top. Stack: React + existing Headwaters Books UI.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-01-27",
        steps: [
          {
            title: "Get 3 supplier quotes; confirm specs",
            detail: "Check CDW Canada, Memory Express, and one local Dryden supplier. Prioritise suppliers with same-day Dryden delivery.",
          },
        ],
      },
      {
        isoDate: "2026-01-28",
        steps: [
          {
            title: "Place hardware order — confirm delivery to Dryden address",
            detail: "Keep packing slips and invoices for QuickBooks CAPEX entry and insurance.",
          },
        ],
      },
      {
        isoDate: "2026-01-29",
        steps: [
          {
            title: "Confirm insurance coverage for hardware in transit",
            detail: "Check existing policy. If not covered, get a rider before the delivery truck ships.",
          },
        ],
      },
      {
        isoDate: "2026-01-30",
        steps: [
          {
            title: "Track delivery — confirm estimated arrival dates",
            detail: "Servers first, phones second. Alert OM so someone is on-site for receiving.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 6,
    phase: "Foundation",
    theme: "Dryden lease signed — Dad-warehouse setup begins",
    days: [
      {
        isoDate: "2026-02-02",
        steps: [
          {
            title: "Review Dad-warehouse lease terms",
            detail: "$2,200/mo all-in (rent + utilities). Confirm lease start date aligns with operations target (Apr 13). Document in /Contracts.",
          },
        ],
      },
      {
        isoDate: "2026-02-03",
        steps: [
          {
            title: "Sign lease — collect keys and access fobs",
            detail: "OM receives one set. Practitioner keeps one. Log in key register.",
          },
          {
            title: "Measure and photograph the store floor",
            detail: "Dimensions, door locations, electrical outlet positions, loading dock dimensions. Share with OM for layout planning.",
          },
        ],
      },
      {
        isoDate: "2026-02-04",
        steps: [
          {
            title: "Sketch store floor layout: shelving, till, cold storage, backroom",
            detail: "Till position near entrance. Cold storage at rear. Backroom for staging and OM desk.",
          },
        ],
      },
      {
        isoDate: "2026-02-05",
        steps: [
          {
            title: "Order shelving, refrigeration units, and display fixtures",
            detail: "Source locally where possible. Lead times: refrigeration ~3 weeks, shelving ~1 week.",
          },
        ],
      },
      {
        isoDate: "2026-02-06",
        steps: [
          {
            title: "Confirm utilities and internet connection at store",
            detail: "Internet: minimum 100 Mbps for Square and Local Line reliability. If fibre not available, LTE backup.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 7,
    phase: "Foundation",
    theme: "Square POS configuration",
    days: [
      {
        isoDate: "2026-02-09",
        steps: [
          {
            title: "Create Square account and configure Ontario tax codes",
            detail: "HST 13% on most items. Exempt: basic groceries. Double-check exemption list against your SKU plan.",
            actions: [
              {
                type: "copy-replit-task-brief",
                label: "Build the Square POS mockup",
                content: "Build a Square POS day-1 operations mockup for a small community food store. The mockup should simulate: (1) a product catalog with ~20 grocery SKUs including prices and tax codes (HST 13% or exempt), (2) a checkout flow showing item scan → cart → payment → receipt, (3) an end-of-day cash reconciliation screen showing expected vs. actual drawer count, and (4) a daily sales summary view. Use React + Vite. No real Square API needed — this is a functional UI prototype for staff training.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-02-10",
        steps: [
          {
            title: "Build product catalog — initial 40 SKUs from producer list",
            detail: "Group by category: Produce, Meat, Dairy, Dry Goods, Frozen. Include unit cost and retail price per item.",
          },
        ],
      },
      {
        isoDate: "2026-02-11",
        steps: [
          {
            title: "Configure Square cash drawer and receipt printer",
            detail: "Test receipt printer formatting. Confirm store name, address, and tax number appear on receipts.",
          },
        ],
      },
      {
        isoDate: "2026-02-12",
        steps: [
          {
            title: "Full end-to-end POS test: sale → cash payment → receipt → settlement",
            detail: "Run 10 test transactions across all product categories. Verify tax calculation is correct.",
          },
        ],
      },
      {
        isoDate: "2026-02-13",
        steps: [
          {
            title: "Run Square training session with food handler candidate",
            detail: "Cover: opening the till, processing a sale, voiding an item, running the day-end report.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 8,
    phase: "Foundation",
    theme: "Local Line producer portal setup",
    days: [
      {
        isoDate: "2026-02-16",
        steps: [
          {
            title: "Create Local Line agency account and configure ordering windows",
            detail: "Set bi-weekly ordering cycle. Order window opens Monday AM, closes Wednesday noon. Delivery Friday.",
          },
        ],
      },
      {
        isoDate: "2026-02-17",
        steps: [
          {
            title: "Onboard first 3 producers — profiles, pricing, minimum orders",
            detail: "Each producer needs: business name, contact, product list, prices, minimum order, and delivery terms.",
          },
        ],
      },
      {
        isoDate: "2026-02-18",
        steps: [
          {
            title: "Build ordering calendar for the first 8 weeks of operation",
            detail: "Map every order cycle from Apr 13 to Jun 7. Share with OM and bookkeeper.",
          },
        ],
      },
      {
        isoDate: "2026-02-19",
        steps: [
          {
            title: "Test producer order flow end-to-end",
            detail: "Place a test order, confirm producer receives notification, check invoice format.",
          },
        ],
      },
      {
        isoDate: "2026-02-20",
        steps: [
          {
            title: "Send producer welcome email with portal walkthrough",
            detail: "Include login instructions, ordering window dates, and your direct contact number.",
            actions: [
              {
                type: "copy-ai-prompt",
                label: "Write producer welcome email",
                content: "Write a warm, professional welcome email to a local food producer who is being onboarded onto Local Line, a producer-to-store ordering platform. The store is a community food store operated by Headwaters Development Services for a First Nations community in northern Ontario. The email should cover: (1) a brief intro to the store and its community mission, (2) how to log into Local Line and update your product list, (3) the ordering cycle (bi-weekly, order window Mon–Wed noon, delivery Friday), (4) how invoicing works (30-day payment terms), and (5) who to call if something goes wrong. Tone: warm, practical, relationship-first.",
              },
            ],
          },
        ],
      },
    ],
  },

  {
    isoWeek: 9,
    phase: "Foundation",
    theme: "QuickBooks setup and bookkeeper onboarding",
    days: [
      {
        isoDate: "2026-02-23",
        steps: [
          {
            title: "Create QuickBooks Online company file",
            detail: "Set chart of accounts: Revenue (Store Sales), COGS (Produce, Meat, Dairy, Dry Goods), Operating Expenses by category, Bridge Capital (liability), Payroll.",
          },
        ],
      },
      {
        isoDate: "2026-02-24",
        steps: [
          {
            title: "Bookkeeper onboarding call",
            detail: "Walk through chart of accounts, monthly close schedule (5th of each month), and preferred communication channel.",
          },
        ],
      },
      {
        isoDate: "2026-02-25",
        steps: [
          {
            title: "Configure Square → QuickBooks integration",
            detail: "Daily Square sales sync to QuickBooks. Map Square categories to QuickBooks accounts.",
            actions: [
              {
                type: "copy-replit-task-brief",
                label: "Build the Square→QuickBooks sync checker",
                content: "Build a simple daily reconciliation checker tool in the Headwaters Books app. It should accept two inputs: (1) a Square daily sales total (pasted in) and (2) a QuickBooks daily revenue entry (pasted in). It should flag any discrepancy > $1.00 in red and show 'MATCHED' in green when they agree. Include a log of the last 30 days of checks with date, Square total, QB total, and difference. Stack: React + existing Headwaters Books UI.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-02-26",
        steps: [
          {
            title: "Configure payroll in QuickBooks: OM, food handler, bookkeeper",
            detail: "Add each employee. Confirm SIN numbers, pay rates, and pay frequency (bi-weekly).",
          },
        ],
      },
      {
        isoDate: "2026-02-27",
        steps: [
          {
            title: "Run first payroll simulation (dummy data)",
            detail: "Process a test payroll run. Confirm deductions (CPP, EI, income tax) are calculating correctly.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 10,
    phase: "Foundation",
    theme: "Food handler hire and food safety certification",
    days: [
      {
        isoDate: "2026-03-02",
        steps: [
          {
            title: "Post food handler job on Deer Lake community board first",
            detail: "Prioritise community members. This is a permanent, living-wage role — signal that clearly.",
            actions: [
              {
                type: "copy-ai-prompt",
                label: "Write the food handler job posting",
                content: "Write a job posting for a Food Handler / Store Associate role at a community food store in northern Ontario, run by Headwaters Development Services for a First Nations band council. The role is full-time, on-site, living wage (confirm rate). Responsibilities: operate Square POS, stock shelves, receive deliveries, maintain food safety standards, assist community members. Required: food handler certification (or willingness to obtain within 30 days of hire). Asset: community member of Deer Lake or surrounding area. Tone: welcoming, community-first, plain language.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-03-03",
        steps: [
          {
            title: "Interview 2 top candidates",
            detail: "Ask: Tell me about a time you helped someone who was frustrated. How do you handle a busy rush on your own?",
          },
        ],
      },
      {
        isoDate: "2026-03-04",
        steps: [
          {
            title: "Select candidate and send offer",
            detail: "Confirm start date, rate, and reporting line (OM day-to-day, practitioner for any escalations).",
          },
        ],
      },
      {
        isoDate: "2026-03-05",
        steps: [
          {
            title: "Book food safety certification course (Safe Food Handler, Ontario)",
            detail: "Online or in-person in Dryden. Must be complete before the store opens.",
          },
        ],
      },
      {
        isoDate: "2026-03-06",
        steps: [
          {
            title: "Prepare food handler onboarding kit",
            detail: "Items: operations handbook, Square login, daily open/close checklist, emergency contact list, food safety quick reference.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 11,
    phase: "Foundation",
    theme: "Community introduction at Deer Lake",
    days: [
      {
        isoDate: "2026-03-09",
        steps: [
          {
            title: "Prepare community presentation deck (10 slides max)",
            detail: "Slides: Who we are, What the store will carry, How prices compare to Dryden, How to order for pickup, Community ownership of this project.",
            actions: [
              {
                type: "copy-ai-prompt",
                label: "Draft community presentation talking points",
                content: "I'm presenting a new community food store to a First Nations band council and community members at Deer Lake, northern Ontario. The store is run by Headwaters Development Services. Write talking points for a 10-minute community introduction covering: (1) who Headwaters is and why we're here, (2) what the store will carry and where the food comes from (local producers), (3) how our prices compare to Dryden grocery stores, (4) how community members can request specific items, (5) how the store is accountable to the community (monthly reports to council). Tone: warm, humble, plain language — this is a community meeting, not a boardroom pitch.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-03-10",
        steps: [
          {
            title: "Travel to Deer Lake — community meeting with band council",
            detail: "Practitioner and OM both attend. Bring printed one-pager and a sample product list.",
          },
        ],
      },
      {
        isoDate: "2026-03-11",
        steps: [
          {
            title: "Community Q&A session — record every question asked",
            detail: "Questions reveal what the community actually needs. Review before updating the product catalog.",
          },
        ],
      },
      {
        isoDate: "2026-03-12",
        steps: [
          {
            title: "Follow-up notes filed — action items assigned",
            detail: "At minimum: confirm top 10 requested items are in the catalog before launch.",
          },
        ],
      },
      {
        isoDate: "2026-03-13",
        steps: [
          {
            title: "Update FAQ document based on community questions",
            detail: "Post the FAQ on the community notice board and band social media. Transparency builds trust.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 12,
    phase: "Foundation",
    theme: "Soft open #1 — first producer delivery",
    days: [
      {
        isoDate: "2026-03-16",
        steps: [
          {
            title: "Confirm first producer order via Local Line",
            detail: "20–25 SKUs. Focus on high-request items from community meeting. Confirm delivery for Wednesday.",
          },
        ],
      },
      {
        isoDate: "2026-03-17",
        steps: [
          {
            title: "Receive first delivery — stock shelves with food handler and OM",
            detail: "Record each item against the Local Line order. Flag any substitutions or shorts immediately.",
          },
        ],
      },
      {
        isoDate: "2026-03-18",
        steps: [
          {
            title: "Soft open: invite 10 community members to shop",
            detail: "Invite the band council liaison and 9 community members. Ask them to actually buy things — real transactions.",
          },
        ],
      },
      {
        isoDate: "2026-03-19",
        steps: [
          {
            title: "Cash reconciliation — Square settlement vs. till count",
            detail: "Square closes at 11:59 PM. Till count first thing Thursday. Any difference > $2 requires written explanation.",
          },
        ],
      },
      {
        isoDate: "2026-03-20",
        steps: [
          {
            title: "Soft open #1 debrief with OM and food handler",
            detail: "Ask: What broke? What surprised you? What did customers ask for that we didn't have? Write it all down.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 13,
    phase: "Foundation",
    theme: "Soft open #2 — process refinement",
    days: [
      {
        isoDate: "2026-03-23",
        steps: [
          {
            title: "Fix all items from soft open #1 debrief",
            detail: "No issue carries over to soft open #2 unsolved. If something can't be fixed, document why and what the workaround is.",
          },
        ],
      },
      {
        isoDate: "2026-03-24",
        steps: [
          {
            title: "Soft open #2 — 20 community members, broader test",
            detail: "Include some community members who are less tech-comfortable. Observe the checkout experience closely.",
          },
        ],
      },
      {
        isoDate: "2026-03-25",
        steps: [
          {
            title: "Review Square sales data — average basket size, top 5 SKUs",
            detail: "These two soft opens are your baseline. Everything in Pilot Execution is measured against them.",
          },
        ],
      },
      {
        isoDate: "2026-03-26",
        steps: [
          {
            title: "Bookkeeper mini-close call — first reconciliation rehearsal",
            detail: "Run through the monthly close steps with real (soft open) data. Identify any confusion before launch.",
          },
        ],
      },
      {
        isoDate: "2026-03-27",
        steps: [
          {
            title: "Update daily operating checklist based on soft open learnings",
            detail: "The checklist must be so clear that any trained team member can run the store on their own.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 14,
    phase: "Foundation",
    theme: "Staff training week",
    days: [
      {
        isoDate: "2026-03-30",
        steps: [
          {
            title: "Full-day Square POS training with food handler",
            detail: "Scenarios: regular sale, void, refund, split payment, end-of-day report, float count.",
          },
        ],
      },
      {
        isoDate: "2026-03-31",
        steps: [
          {
            title: "Local Line ordering training with OM",
            detail: "Walk through a complete order cycle: browse → add to cart → submit → receive invoice → match to delivery.",
          },
        ],
      },
      {
        isoDate: "2026-04-01",
        steps: [
          {
            title: "QuickBooks daily entry training with bookkeeper",
            detail: "Cover: entering Square settlement, paying a Local Line invoice, recording payroll, and running a P&L.",
          },
        ],
      },
      {
        isoDate: "2026-04-02",
        steps: [
          {
            title: "Emergency procedures and food safety review",
            detail: "Cover: power outage (Square offline mode), till discrepancy protocol, food safety recall process.",
          },
        ],
      },
      {
        isoDate: "2026-04-03",
        steps: [
          {
            title: "Staff sign-off on training checklists",
            detail: "All three staff (OM, food handler, bookkeeper) sign the training acknowledgement. File in /Staff.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 15,
    phase: "Foundation",
    theme: "Pre-launch readiness check",
    days: [
      {
        isoDate: "2026-04-06",
        steps: [
          {
            title: "Final store walk-through — punch-list of 5 remaining items",
            detail: "OM leads. Practitioner reviews. Nothing makes it to launch week unsolved.",
          },
        ],
      },
      {
        isoDate: "2026-04-07",
        steps: [
          {
            title: "Confirm opening inventory levels for launch week",
            detail: "Place final pre-launch order on Local Line. Confirm delivery arrives by Apr 12.",
          },
        ],
      },
      {
        isoDate: "2026-04-08",
        steps: [
          {
            title: "Community launch announcement — band social media + notice board",
            detail: "State the date, hours, location, and a clear message: 'Your community. Your store. Open Monday.'",
            actions: [
              {
                type: "copy-ai-prompt",
                label: "Write the launch announcement",
                content: "Write a short community launch announcement for a new food store opening at Deer Lake, operated by Headwaters Development Services for the band council. The store opens Monday April 13. Hours: 9 AM – 6 PM, Monday through Saturday. Location: the aggregation hub on [address]. The announcement will appear on the band's Facebook page and community notice board. Tone: excited, welcoming, plain language. Keep it under 100 words. Include a call to action: come in on Monday, introduce yourself to the team.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-04-09",
        steps: [
          {
            title: "Producer communication — confirm launch week deliveries locked in",
            detail: "All three producers confirm delivery by Friday Apr 11. No exceptions — shelves must be full on Day 1.",
          },
        ],
      },
      {
        isoDate: "2026-04-10",
        steps: [
          {
            title: "Practitioner go/no-go review — brief band council on launch plan",
            detail: "Final check: store ready, staff trained, inventory incoming, Square live, QuickBooks ready. Send the council a one-page Day-1 brief.",
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  PILOT EXECUTION  W16–W44  (Apr 13 – Nov 1, 2026)
  // ══════════════════════════════════════════════════════════

  {
    isoWeek: 16,
    phase: "Pilot Execution",
    theme: "Day-1 store launch",
    days: [
      {
        isoDate: "2026-04-13",
        steps: [
          {
            title: "Launch day — store opens to community (9 AM)",
            detail: "Practitioner on-site. Food handler runs the till. OM manages floor and restocking. Count every transaction.",
          },
          {
            title: "Day-1 Square sales pull at close",
            detail: "Record: transaction count, total revenue, average basket size, top 3 SKUs. This is your baseline.",
          },
        ],
      },
      {
        isoDate: "2026-04-14",
        steps: [
          {
            title: "Day 2 — monitor queue management and peak-hour flow",
            detail: "Observe: does the till back up? Is there a bottleneck at the entrance? Note for Friday debrief.",
          },
          {
            title: "Send invoice #1 to band council finance office",
            detail: "Invoice for Month 1 retainer. Net-60 means cash arrives ~Jun 13. Log expected cash date.",
          },
        ],
      },
      {
        isoDate: "2026-04-15",
        steps: [
          {
            title: "Day 3 cash reconciliation — Square report vs. till count",
            detail: "The first clean reconciliation sets the standard. Any variance over $2 gets a written explanation in the log.",
          },
        ],
      },
      {
        isoDate: "2026-04-16",
        steps: [
          {
            title: "Place first live Local Line reorder based on sell-through",
            detail: "What sold out? What moved slowly? Adjust this week's order accordingly.",
          },
        ],
      },
      {
        isoDate: "2026-04-17",
        steps: [
          {
            title: "Week 1 sales summary email to band council",
            detail: "Keep it one page: revenue, transaction count, top items, any issues, next week's plan.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 17,
    phase: "Pilot Execution",
    theme: "First full week of live operations",
    days: [
      {
        isoDate: "2026-04-20",
        steps: [
          {
            title: "Open checklist confirmed by food handler before 9 AM",
            detail: "Checklist: till float counted and recorded, cold storage temperature logged, Square signed in, shelves faced.",
          },
          {
            title: "OM reviews prior-week Square data",
            detail: "Compare Week 1 vs. the soft open baseline. Is traffic growing? Any SKU running out before reorder?",
          },
        ],
      },
      {
        isoDate: "2026-04-21",
        steps: [
          {
            title: "OM quality walk-through — store condition, pricing accuracy, expiry checks",
            detail: "Document any products near expiry. Mark down or pull before they expire — no waste.",
          },
        ],
      },
      {
        isoDate: "2026-04-22",
        steps: [
          {
            title: "Square settlement vs. QuickBooks entry check — first live reconciliation",
            detail: "Bookkeeper confirms Square deposit matches bank deposit. Any discrepancy flags immediately.",
          },
        ],
      },
      {
        isoDate: "2026-04-23",
        steps: [
          {
            title: "Producer delivery #2 received and stocked",
            detail: "OM or food handler counts every item against the Local Line order. Discrepancies reported to producer within 24 hrs.",
          },
        ],
      },
      {
        isoDate: "2026-04-24",
        steps: [
          {
            title: "Week 2 sales report — identify top-5 SKUs and bottom-5",
            detail: "Top 5 need reliable restock. Bottom 5 get reduced order quantity or replaced with community-requested items.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 18,
    phase: "Pilot Execution",
    theme: "Operations stabilisation",
    days: [
      {
        isoDate: "2026-04-27",
        steps: [
          {
            title: "Adjust store hours based on Week 1-2 traffic data",
            detail: "If foot traffic is light before 10 AM, consider opening at 9:30 AM and running later to 6:30 PM.",
          },
          {
            title: "Review Square by-hour report — find peak traffic windows",
            detail: "Most community stores peak 11 AM–1 PM and 4–6 PM. Staff the floor for those windows.",
          },
        ],
      },
      {
        isoDate: "2026-04-28",
        steps: [
          {
            title: "Onboard second producer on Local Line",
            detail: "Add products to catalog. Confirm their delivery day aligns with the existing schedule.",
          },
        ],
      },
      {
        isoDate: "2026-04-29",
        steps: [
          {
            title: "Bookkeeper April mid-month check-in",
            detail: "Review open invoices, confirm payroll on track for Apr 30, flag any QuickBooks issues.",
          },
        ],
      },
      {
        isoDate: "2026-04-30",
        steps: [
          {
            title: "Square POS firmware update — test after updating",
            detail: "Always run a test transaction before the next business day after any Square update.",
          },
        ],
      },
      {
        isoDate: "2026-05-01",
        steps: [
          {
            title: "Establish OM weekly note template",
            detail: "OM sends practitioner a 5-bullet note every Friday: Sales, Staff, Inventory, Issues, Next week.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 19,
    phase: "Pilot Execution",
    theme: "April month-end close",
    days: [
      {
        isoDate: "2026-05-04",
        steps: [
          {
            title: "Pull Square April sales report (Apr 13–30)",
            detail: "Export CSV. Share with bookkeeper. Key metrics: total revenue, transaction count, refunds.",
          },
        ],
      },
      {
        isoDate: "2026-05-05",
        steps: [
          {
            title: "QuickBooks April close with bookkeeper",
            detail: "Close date: April 30. Lock the period once reconciled. No backdating after close.",
          },
        ],
      },
      {
        isoDate: "2026-05-06",
        steps: [
          {
            title: "Reconcile petty cash and till float",
            detail: "Count the till. Count petty cash. Both must match the log. Any variance gets a written note.",
          },
        ],
      },
      {
        isoDate: "2026-05-07",
        steps: [
          {
            title: "Draft first monthly report for band council",
            detail: "Structure: Executive summary (3 bullets), Operations overview, Financial summary (revenue vs. budget), Top 3 issues, Next 30 days.",
            actions: [
              {
                type: "copy-ai-prompt",
                label: "Draft the April council report",
                content: "Write a one-page monthly report for a First Nations band council about the first month of operations of their community food store, managed by Headwaters Development Services. The store opened April 13. Include sections for: (1) Executive Summary — 3 key bullets on what happened, (2) Operations Overview — store traffic, top products sold, any operational issues resolved, (3) Financial Summary — total sales revenue for the half-month, with a note that full-month reporting starts in May, (4) What's coming in May — ordering plan, staff development, any capital items. Tone: transparent, accountable, plain language for a council audience.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-05-08",
        steps: [
          {
            title: "Send April report to band council; calendar May milestones",
            detail: "Flag: invoice #1 cash arrives ~June 13. Bridge capital holding until then. No cash-flow concern yet.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 20,
    phase: "Pilot Execution",
    theme: "Producer review and May planning",
    days: [
      {
        isoDate: "2026-05-11",
        steps: [
          {
            title: "Review all producer pricing vs. Dryden retail comparables",
            detail: "Pull 10 SKUs from Local Line. Compare to Dryden FreshCo or Walmart equivalent. Community savings should average ≥15%.",
            actions: [
              {
                type: "copy-replit-task-brief",
                label: "Build the producer price comparison tool",
                content: "In the Headwaters Books app, add a Price Comparison section. It should show a table of store SKUs with: Item name, Our price (from Local Line), Nearest Dryden retail price (manually entered), and a Community Savings % column auto-calculated as ((Dryden price - Our price) / Dryden price × 100). Flag items where savings are < 10% in amber and > 20% in green. Add a 'Last updated' date per item. The table must be exportable as CSV for the monthly council report.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-05-12",
        steps: [
          {
            title: "Local Line order cycle 3 — adjust quantities based on April sell-through",
            detail: "Increase quantity on the top 5 SKUs by 20%. Remove or reduce the bottom 3 performers.",
          },
        ],
      },
      {
        isoDate: "2026-05-13",
        steps: [
          {
            title: "Community feedback session — informal, in-store",
            detail: "Post a feedback board in the store this week. 3 questions: What do you love? What's missing? What would make you shop here more?",
          },
          {
            title: "Review bank account — confirm invoice #1 expected date",
            detail: "Bridge capital still holding. Invoice #1 (Apr 13) nets 60 days = Jun 13. On track.",
          },
        ],
      },
      {
        isoDate: "2026-05-14",
        steps: [
          {
            title: "Bookkeeper sync — confirm May payroll and invoice schedule",
            detail: "Payroll runs May 15 and May 30. Confirm sufficient bridge balance to cover both.",
          },
        ],
      },
      {
        isoDate: "2026-05-15",
        steps: [
          {
            title: "Practitioner weekly review — Q2 priorities and risk check",
            detail: "Write three Q2 priorities. Check for any risks that need escalation to council this week.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 21,
    phase: "Pilot Execution",
    theme: "Expand producer network — first outreach wave",
    days: [
      {
        isoDate: "2026-05-18",
        steps: [
          {
            title: "Identify 3 new potential producers from community leads",
            detail: "Ask: who do community members want to see in the store? Local hunters, fishers, and gardeners are priority.",
          },
        ],
      },
      {
        isoDate: "2026-05-19",
        steps: [
          {
            title: "Outreach calls to new producer candidates",
            detail: "15-minute intro call. Ask about capacity, pricing, and whether they're set up to invoice.",
            actions: [
              {
                type: "copy-ai-prompt",
                label: "Write producer outreach script",
                content: "Write a 15-minute phone call script for reaching out to a potential new producer — a local hunter or small-scale food grower — to invite them to sell through our community food store in northern Ontario. The call should cover: (1) quick intro to the store and its community mission, (2) how Local Line works (we send you orders, you deliver, we pay within 30 days), (3) what they'd need to do to get started (food safety, labeling), (4) answering the 'is it worth my time?' question honestly, and (5) next steps if they're interested. Tone: relaxed, peer-to-peer, no sales pressure.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-05-20",
        steps: [
          {
            title: "Local Line order cycle 4 — week 6 of operations",
            detail: "Place order by Wednesday noon. Confirm delivery Friday.",
          },
        ],
      },
      {
        isoDate: "2026-05-21",
        steps: [
          {
            title: "Square product catalog update — add new SKUs from new producers",
            detail: "Add at least 5 new SKUs this week. Confirm tax classification (exempt vs. HST) for each.",
          },
        ],
      },
      {
        isoDate: "2026-05-22",
        steps: [
          {
            title: "Weekly review — producer pipeline, sales trend, staff check",
            detail: "OM note filed. Sales trending up or flat? Any staff concerns?",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 22,
    phase: "Pilot Execution",
    theme: "May month-end close",
    days: [
      {
        isoDate: "2026-05-25",
        steps: [
          {
            title: "Pull Square May sales report",
            detail: "First full calendar month of data. May is the benchmark — every month is measured against it.",
          },
        ],
      },
      {
        isoDate: "2026-05-26",
        steps: [
          {
            title: "QuickBooks May close with bookkeeper",
            detail: "Close date: May 31 (run the close Monday May 25, finalize by Friday). Lock the period.",
          },
        ],
      },
      {
        isoDate: "2026-05-27",
        steps: [
          {
            title: "Producer payment run — confirm all Local Line invoices paid",
            detail: "Every producer invoice due in May must clear by May 31. No outstanding AP going into June.",
          },
        ],
      },
      {
        isoDate: "2026-05-28",
        steps: [
          {
            title: "Draft May council report",
            detail: "Include first full-month revenue, producer count, SKU count, average basket, and community savings vs. Dryden retail.",
          },
        ],
      },
      {
        isoDate: "2026-05-29",
        steps: [
          {
            title: "Send May report and confirm June producer delivery schedule",
            detail: "June has a long weekend (Victoria Day already passed). Confirm all producers are aware of the June 1 ordering window opening.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 23,
    phase: "Pilot Execution",
    theme: "June operations — cooking demo and community programming",
    days: [
      {
        isoDate: "2026-06-01",
        steps: [
          {
            title: "Set June ordering calendar on Local Line",
            detail: "Flag the June 15 holiday (if applicable). Adjust delivery dates to avoid gaps.",
          },
        ],
      },
      {
        isoDate: "2026-06-02",
        steps: [
          {
            title: "Plan in-store cooking demo with a local producer",
            detail: "Invite a producer to demonstrate one recipe using products available in the store. Announce on band social media.",
            actions: [
              {
                type: "copy-ai-prompt",
                label: "Write the cooking demo announcement",
                content: "Write a Facebook post for a First Nations band page announcing a free in-store cooking demonstration at the community food store. A local producer will be making [recipe] using ingredients available in the store. Date: [TBD]. Time: 2 PM. Location: [store address]. Encourage community members to come try a sample and learn a new recipe. Tone: warm, exciting, community-proud. Under 80 words.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-06-03",
        steps: [
          {
            title: "Food handler mid-month check-in",
            detail: "Ask: How are you feeling? Any hours or schedule concerns? Anything the OM can do to make your job easier?",
          },
        ],
      },
      {
        isoDate: "2026-06-04",
        steps: [
          {
            title: "Square 8-week trend analysis — review with OM",
            detail: "Is basket size growing? Are visits per week increasing? Plot the data, even just in a spreadsheet.",
          },
        ],
      },
      {
        isoDate: "2026-06-05",
        steps: [
          {
            title: "OM site maintenance check — refrigeration, shelving, IT equipment",
            detail: "Check refrigeration temperatures and door seals. Check for shelving damage. IT: are all computers and the router running clean?",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 24,
    phase: "Pilot Execution",
    theme: "Producer pricing review — community savings report",
    days: [
      {
        isoDate: "2026-06-08",
        steps: [
          {
            title: "Pull all current producer prices from Local Line",
            detail: "Create a clean price list: Item, Producer, Our price, Unit size. This becomes the input for the savings comparison.",
          },
        ],
      },
      {
        isoDate: "2026-06-09",
        steps: [
          {
            title: "Compare to Dryden retail prices — flag anomalies",
            detail: "Visit the Dryden FreshCo or Walmart website for comps. Items where our price exceeds Dryden retail need an explanation.",
            actions: [
              {
                type: "copy-replit-task-brief",
                label: "Build the price-comparison dashboard",
                content: "Build a price comparison dashboard in the Headwaters Books app. Import the store's Local Line product prices (CSV upload or manual entry). Allow side-by-side comparison with manually entered Dryden retail prices. Show: item name, our price, Dryden price, savings ($), savings (%), and a status badge (green = >15% savings, amber = 5–15%, red = <5%). Include a summary card showing overall average community savings %. Export to PDF for inclusion in the monthly council report.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-06-10",
        steps: [
          {
            title: "Draft pricing review memo for band council",
            detail: "One page: how our prices compare, which producers deliver best savings, any items we should source differently.",
          },
        ],
      },
      {
        isoDate: "2026-06-11",
        steps: [
          {
            title: "Confirm harvest-season ordering volumes with producers",
            detail: "Reach out to all current producers. What is their summer/harvest capacity? Any new products available?",
          },
        ],
      },
      {
        isoDate: "2026-06-12",
        steps: [
          {
            title: "Update Local Line product prices for summer ordering cycle",
            detail: "Confirm all prices are current before the June 15 ordering window opens.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 25,
    phase: "Pilot Execution",
    theme: "Mid-pilot progress review (8 weeks in)",
    days: [
      {
        isoDate: "2026-06-15",
        steps: [
          {
            title: "Compile 8-week KPI summary",
            detail: "Metrics: total revenue, transaction count, average basket size, SKU count, active producers, community savings %.",
          },
        ],
      },
      {
        isoDate: "2026-06-16",
        steps: [
          {
            title: "Internal review — practitioner, OM, bookkeeper on call",
            detail: "30-minute call. Questions: What's working? What's not? What needs a decision in the next 30 days?",
          },
        ],
      },
      {
        isoDate: "2026-06-17",
        steps: [
          {
            title: "Draft mid-pilot memo for band council",
            detail: "2 pages: KPI summary, operational narrative, financial status (bridge recovery on track), next 90 days.",
            actions: [
              {
                type: "copy-ai-prompt",
                label: "Draft the mid-pilot council memo",
                content: "Write a 2-page mid-pilot progress memo to a First Nations band council from Headwaters Development Services, 8 weeks into operating the community food store. Cover: (1) Operations summary — store is running, staff performing well, X transactions, X products available, (2) Financial summary — revenue on track, bridge capital recovery timeline, (3) Community impact — savings vs. Dryden retail, products unique to community, (4) Challenges resolved and outstanding, (5) Next 90 days — summer throughput plan, producer expansion, Pilot #2 scoping begins. Tone: honest, accountable, forward-looking.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-06-18",
        steps: [
          {
            title: "Send mid-pilot memo — schedule council review call",
            detail: "Give the council 48 hours to read before the call. Come prepared with 3 decisions that need council input.",
          },
        ],
      },
      {
        isoDate: "2026-06-19",
        steps: [
          {
            title: "Identify 3 process improvements for H2",
            detail: "Write them as concrete actions with owners and deadlines. Not aspirations — actual changes to make.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 26,
    phase: "Pilot Execution",
    theme: "Community feedback and survey",
    days: [
      {
        isoDate: "2026-06-22",
        steps: [
          {
            title: "Design 10-question community survey (print + verbal option)",
            detail: "Keep it short and accessible. Include: satisfaction with products, prices, hours, and staff. Leave space for open comments.",
            actions: [
              {
                type: "copy-ai-prompt",
                label: "Write the community survey questions",
                content: "Write 10 short survey questions for community members of a First Nations community about their experience with the local food store, run by Headwaters Development Services. The store has been open for 10 weeks. Questions should cover: product selection, pricing, store hours, staff friendliness, ease of shopping, community impact. Include 2–3 open-ended questions. Use plain language, grade 6 reading level. The survey will be printed and administered in person at the store and at the band office. Include a brief intro paragraph explaining why the survey matters.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-06-23",
        steps: [
          {
            title: "Administer survey — in-store and via band office",
            detail: "Target: 30 responses. Food handler can administer in-store. Band admin can distribute at the office.",
          },
        ],
      },
      {
        isoDate: "2026-06-24",
        steps: [
          {
            title: "Compile and tally survey results",
            detail: "Quantitative questions: calculate averages. Open comments: group by theme. Identify top 3 concerns and top 3 positives.",
          },
        ],
      },
      {
        isoDate: "2026-06-25",
        steps: [
          {
            title: "Community meeting — present results, discuss improvements",
            detail: "Share results honestly, including the critical feedback. Show 3 changes you will make based on what you heard.",
          },
        ],
      },
      {
        isoDate: "2026-06-26",
        steps: [
          {
            title: "Debrief and update operating plan with community input",
            detail: "File survey results in /Council-Reports. Update the operating checklist with any changes committed to at the meeting.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 27,
    phase: "Pilot Execution",
    theme: "Q2 financial close",
    days: [
      {
        isoDate: "2026-06-29",
        steps: [
          {
            title: "Pull Q2 Square data (Apr–Jun) and send to bookkeeper",
            detail: "Three months of data. Export CSV by month. Bookkeeper reconciles each month against QuickBooks.",
          },
        ],
      },
      {
        isoDate: "2026-06-30",
        steps: [
          {
            title: "QuickBooks June close — Q2 finalized",
            detail: "Lock all three months once reconciled. Run a Q2 P&L and balance sheet.",
          },
        ],
      },
      {
        isoDate: "2026-07-01",
        steps: [
          {
            title: "Canada Day — reduced store hours; staff rest day",
            detail: "Store open half-day if community traffic warrants it. No administrative work today.",
          },
        ],
      },
      {
        isoDate: "2026-07-02",
        steps: [
          {
            title: "Q2 financial summary — revenue, cost basis, reinvestment accumulation",
            detail: "Key question: is the reinvestment reserve accumulating on schedule? Check against the budget model.",
          },
        ],
      },
      {
        isoDate: "2026-07-03",
        steps: [
          {
            title: "Q2 report filed with band council and practitioner CFO",
            detail: "Include bridge capital status. By Q2 end, invoices #1 and #2 should have cleared. Confirm.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 28,
    phase: "Pilot Execution",
    theme: "Pilot #2 scoping begins",
    days: [
      {
        isoDate: "2026-07-06",
        steps: [
          {
            title: "Review Pilot #2 community options with CDA",
            detail: "The Community Development Associate has been tracking two candidate communities. Review readiness criteria for each.",
          },
        ],
      },
      {
        isoDate: "2026-07-07",
        steps: [
          {
            title: "Internal research session: what made Deer Lake work",
            detail: "Document 5 critical success factors from the Deer Lake launch. These become the Pilot #2 checklist.",
          },
        ],
      },
      {
        isoDate: "2026-07-08",
        steps: [
          {
            title: "Draft Pilot #2 scoping brief (2 pages)",
            detail: "Cover: candidate community criteria, engagement model, resource requirements, timeline from scoping to Day 1.",
            actions: [
              {
                type: "copy-ai-prompt",
                label: "Draft the Pilot #2 scoping brief",
                content: "Write a 2-page Pilot #2 scoping brief for Headwaters Development Services. Pilot #1 is running a community food store for a First Nations band council in northern Ontario. The brief should cover: (1) criteria for a qualified Pilot #2 community (population size, existing food sovereignty interest, council readiness, access), (2) the engagement model we'd use (same team structure, same tech stack), (3) resource requirements (rough cost estimate, personnel), (4) timeline from first community contact to store Day 1 (approx. 16 weeks), (5) how Pilot #2 success would be defined. Tone: strategic, grounded in Pilot #1 learnings.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-07-09",
        steps: [
          {
            title: "CDA outreach — schedule community intro for Pilot #2 candidate community",
            detail: "The goal is a first visit in August. Confirm travel logistics and who the community contact is.",
          },
        ],
      },
      {
        isoDate: "2026-07-10",
        steps: [
          {
            title: "Confirm Pilot #2 scoping timeline with practitioner",
            detail: "Target: first community visit Aug, feasibility note Sep, brief finalized Oct.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 29,
    phase: "Pilot Execution",
    theme: "Summer throughput — peak demand planning",
    days: [
      {
        isoDate: "2026-07-13",
        steps: [
          {
            title: "Increase Local Line ordering volumes 20% for summer peak",
            detail: "Summer traffic historically higher. Better to over-order and markdown than to run out.",
          },
        ],
      },
      {
        isoDate: "2026-07-14",
        steps: [
          {
            title: "Post summer floor support position — part-time food handler backup",
            detail: "2–3 days/week through August and September. Community member preferred.",
          },
        ],
      },
      {
        isoDate: "2026-07-15",
        steps: [
          {
            title: "Review Square peak-day data — adjust open/close times for summer",
            detail: "If Saturday is the highest traffic day, consider extended Saturday hours.",
          },
        ],
      },
      {
        isoDate: "2026-07-16",
        steps: [
          {
            title: "Producer check-in call — summer and harvest capacity",
            detail: "Ask each producer: what is your peak summer availability? Any new seasonal products this year?",
          },
        ],
      },
      {
        isoDate: "2026-07-17",
        steps: [
          {
            title: "July week 2 review — inventory, sales, staffing status",
            detail: "OM note filed. Any summer-specific issues to resolve before August?",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 30,
    phase: "Pilot Execution",
    theme: "Staff mid-year reviews",
    days: [
      {
        isoDate: "2026-07-20",
        steps: [
          {
            title: "OM mid-year performance review",
            detail: "Review against role criteria: reliability, store quality, producer relationships, reporting. Be specific with feedback.",
          },
        ],
      },
      {
        isoDate: "2026-07-21",
        steps: [
          {
            title: "Food handler mid-year review",
            detail: "Review: POS accuracy, customer service, food safety compliance, punctuality. Ask what would help them do their job better.",
          },
        ],
      },
      {
        isoDate: "2026-07-22",
        steps: [
          {
            title: "Bookkeeper mid-year review — process improvements",
            detail: "Are closings running on schedule? Any QuickBooks issues that need system changes? Review month-close lead time.",
          },
        ],
      },
      {
        isoDate: "2026-07-23",
        steps: [
          {
            title: "Update staff schedules for August — confirm all coverage",
            detail: "Cover all statutory holidays in August. Confirm the summer floor support hire is on-boarded.",
          },
        ],
      },
      {
        isoDate: "2026-07-24",
        steps: [
          {
            title: "Document any staff concerns; address within 5 business days",
            detail: "Written record of any raised issues and the practitioner response. Protects everyone.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 31,
    phase: "Pilot Execution",
    theme: "Infrastructure and tech health check",
    days: [
      {
        isoDate: "2026-07-27",
        steps: [
          {
            title: "Server and network audit — all 9 nodes healthy",
            detail: "Check uptime, disk usage, and backup status on each server. Any node > 80% disk gets a cleanup.",
            actions: [
              {
                type: "copy-replit-task-brief",
                label: "Build the server health dashboard",
                content: "Build a simple server health dashboard in the Headwaters cockpit (or as a standalone web app). It should display status cards for 9 servers, each showing: server name/role, uptime %, last-seen ping, disk usage %, and a green/amber/red status badge. Data source: manually updated JSON file (no live API needed for v1). Include a 'last full audit' date at the top and an audit notes field. Stack: React + Vite.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-07-28",
        steps: [
          {
            title: "Phone and computer audit — all devices updated",
            detail: "GrapheneOS phones: confirm latest security patch applied. ThinkPads: Ubuntu updates run. Square hardware: firmware current.",
          },
        ],
      },
      {
        isoDate: "2026-07-29",
        steps: [
          {
            title: "Local Line portal review — producer profiles accurate",
            detail: "Check each producer: prices current, products listed correctly, contact info up to date.",
          },
        ],
      },
      {
        isoDate: "2026-07-30",
        steps: [
          {
            title: "IT punch-list — resolve any outstanding issues",
            detail: "5 items maximum. Assign each to a person with a deadline. No carryover to August.",
          },
        ],
      },
      {
        isoDate: "2026-07-31",
        steps: [
          {
            title: "July month-end close",
            detail: "QuickBooks July close with bookkeeper. Confirm payroll cleared. File July council report.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 32,
    phase: "Pilot Execution",
    theme: "Pilot #2 community engagement visit",
    days: [
      {
        isoDate: "2026-08-03",
        steps: [
          {
            title: "CDA travel to Pilot #2 candidate community",
            detail: "CDA and practitioner (if travel is viable). Community intro meeting — same approach as Deer Lake W11.",
          },
        ],
      },
      {
        isoDate: "2026-08-04",
        steps: [
          {
            title: "Community intro session at Pilot #2 site",
            detail: "Present the Deer Lake store model. Honest about what it takes. Ask about community appetite.",
          },
        ],
      },
      {
        isoDate: "2026-08-05",
        steps: [
          {
            title: "Record community feedback and signals",
            detail: "Distinguish between polite interest and genuine readiness. Strong signal: council passes a resolution.",
          },
        ],
      },
      {
        isoDate: "2026-08-06",
        steps: [
          {
            title: "Draft 1-page Pilot #2 feasibility note",
            detail: "Honest assessment: community readiness, space availability, council commitment, timeline to Day 1.",
          },
        ],
      },
      {
        isoDate: "2026-08-07",
        steps: [
          {
            title: "Debrief with practitioner — go/no-go signal for Pilot #2",
            detail: "If go: begin formal scoping. If no-go: return to community options list and identify next candidate.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 33,
    phase: "Pilot Execution",
    theme: "August close prep and harvest-season planning",
    days: [
      {
        isoDate: "2026-08-10",
        steps: [
          {
            title: "Pull August 1–10 sales data — early read on August pace",
            detail: "Compare to July weekly average. Is summer traffic holding? Any SKU running low?",
          },
        ],
      },
      {
        isoDate: "2026-08-11",
        steps: [
          {
            title: "Bookkeeper sync — confirm August 15 payroll",
            detail: "All four staff (OM, food handler, summer support, bookkeeper) on the Aug 15 run.",
          },
        ],
      },
      {
        isoDate: "2026-08-12",
        steps: [
          {
            title: "Producer invoice review — any overdue payments from July?",
            detail: "All July invoices must be paid by Aug 12. Run the AP aging report in QuickBooks.",
          },
        ],
      },
      {
        isoDate: "2026-08-13",
        steps: [
          {
            title: "Confirm September–October ordering volumes with all producers",
            detail: "Harvest season = highest throughput of the year. Pre-book capacity now.",
          },
        ],
      },
      {
        isoDate: "2026-08-14",
        steps: [
          {
            title: "Store preparation for September harvest-season surge",
            detail: "Check cold storage capacity. Order additional produce bins and display baskets if needed.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 34,
    phase: "Pilot Execution",
    theme: "Harvest season preparation",
    days: [
      {
        isoDate: "2026-08-17",
        steps: [
          {
            title: "Confirm all fall producers on Local Line — prices and availability",
            detail: "Every producer who intends to supply Sept–Oct must have current prices entered by Aug 21.",
          },
        ],
      },
      {
        isoDate: "2026-08-18",
        steps: [
          {
            title: "Increase cold storage capacity — temporary refrigeration if needed",
            detail: "Rent a portable cold unit for Oct peak if the permanent unit can't hold harvest volumes.",
          },
        ],
      },
      {
        isoDate: "2026-08-19",
        steps: [
          {
            title: "Update Square catalog — add fall and harvest SKUs",
            detail: "Wild game, harvest berries, root vegetables, preserves. Confirm food safety labeling for each.",
          },
        ],
      },
      {
        isoDate: "2026-08-20",
        steps: [
          {
            title: "Community pre-season announcement — harvest items arriving in September",
            detail: "Post on band social media and the in-store board. Build anticipation.",
          },
        ],
      },
      {
        isoDate: "2026-08-21",
        steps: [
          {
            title: "OM and food handler harvest-season briefing",
            detail: "Cover: higher volumes, faster restocking cadence, any new products that need special handling.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 35,
    phase: "Pilot Execution",
    theme: "Producer onboarding wave 2",
    days: [
      {
        isoDate: "2026-08-24",
        steps: [
          {
            title: "Onboard 2 new producers on Local Line",
            detail: "Complete producer profiles: name, contact, product list, prices, min order, food safety certs on file.",
          },
        ],
      },
      {
        isoDate: "2026-08-25",
        steps: [
          {
            title: "New producer pricing review and community-parity check",
            detail: "New producer prices must maintain ≥15% community savings vs. Dryden retail. Negotiate if needed.",
          },
        ],
      },
      {
        isoDate: "2026-08-26",
        steps: [
          {
            title: "Update in-store signage for new producers",
            detail: "Add producer name cards next to their products. Story behind the food matters to community members.",
          },
        ],
      },
      {
        isoDate: "2026-08-27",
        steps: [
          {
            title: "Community newsletter — introduce new producers",
            detail: "2–3 sentences per producer: who they are, what they grow, why they joined the store.",
            actions: [
              {
                type: "copy-ai-prompt",
                label: "Write the new producer newsletter blurb",
                content: "Write a short newsletter section for a community food store newsletter introducing two new producers joining the store for fall. Each producer gets a 3-sentence blurb covering: who they are (first name, location, what they do), what they're bringing to the store (specific products), and a personal note about why they want to supply the community. Tone: warm, storytelling, first-person friendly. These will appear in a printed band community newsletter.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-08-28",
        steps: [
          {
            title: "August month-end close prep",
            detail: "Square August report ready for bookkeeper by Aug 31. Schedule close for Sep 3.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 36,
    phase: "Pilot Execution",
    theme: "September launch — harvest season opens",
    days: [
      {
        isoDate: "2026-08-31",
        steps: [
          {
            title: "Place first September harvest order on Local Line",
            detail: "Largest order of the year. Confirm every producer has confirmed availability before placing.",
          },
        ],
      },
      {
        isoDate: "2026-09-01",
        steps: [
          {
            title: "Large harvest delivery received — full team for stocking",
            detail: "All staff on deck: OM, food handler, summer support. Cold storage filled first.",
          },
        ],
      },
      {
        isoDate: "2026-09-02",
        steps: [
          {
            title: "Harvest week: monitor hourly sales if possible",
            detail: "Square's by-hour report tells you when the rush is and when you have breathing room.",
          },
        ],
      },
      {
        isoDate: "2026-09-03",
        steps: [
          {
            title: "Square end-of-day reconciliation — harvest week day 3",
            detail: "Cash reconciliation is more critical in high-volume weeks. Count the till twice.",
          },
        ],
      },
      {
        isoDate: "2026-09-04",
        steps: [
          {
            title: "September week 1 report to council",
            detail: "Harvest season open: report first-week sales, top products, and community traffic vs. summer baseline.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 37,
    phase: "Pilot Execution",
    theme: "Peak harvest throughput",
    days: [
      {
        isoDate: "2026-09-07",
        steps: [
          {
            title: "Monitor Square weekly sales vs. September forecast",
            detail: "If actual is tracking 20% above forecast, alert bookkeeper and plan a larger mid-month reorder.",
          },
        ],
      },
      {
        isoDate: "2026-09-08",
        steps: [
          {
            title: "Deploy additional floor support if throughput spikes",
            detail: "Summer support staff is still available through end of September. Use them.",
          },
        ],
      },
      {
        isoDate: "2026-09-09",
        steps: [
          {
            title: "Local Line accelerated reorder — mid-cycle top-up",
            detail: "If fast-moving items are running low by Wednesday, place a spot order with the closest producer.",
          },
        ],
      },
      {
        isoDate: "2026-09-10",
        steps: [
          {
            title: "Cash float top-up and petty cash reconciliation",
            detail: "High-volume week means the float depletes faster. Top up before Friday.",
          },
        ],
      },
      {
        isoDate: "2026-09-11",
        steps: [
          {
            title: "Week review — peak day, top SKU, customer count vs. previous record",
            detail: "Document the records. This data matters for the Year-End Audit and the Pilot #2 business case.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 38,
    phase: "Pilot Execution",
    theme: "Community appreciation event",
    days: [
      {
        isoDate: "2026-09-14",
        steps: [
          {
            title: "Plan community appreciation event — small, in-store, mid-week",
            detail: "Free samples, producer meet-and-greet, a simple display of 5-month impact stats. Keep it under budget.",
          },
        ],
      },
      {
        isoDate: "2026-09-15",
        steps: [
          {
            title: "Event day prep — samples ready, store cleaned, display board set up",
            detail: "Impact display: # community members served, # local producers, % savings vs. Dryden retail.",
          },
        ],
      },
      {
        isoDate: "2026-09-16",
        steps: [
          {
            title: "Community appreciation event — open to all",
            detail: "Capture photos (with consent). Note community comments for the Year-End impact report.",
          },
        ],
      },
      {
        isoDate: "2026-09-17",
        steps: [
          {
            title: "Post-event debrief with OM and food handler",
            detail: "What landed well? What would you do differently? File notes in /Council-Reports.",
          },
        ],
      },
      {
        isoDate: "2026-09-18",
        steps: [
          {
            title: "Publish event photos on band social media — internal note filed",
            detail: "Photo consent confirmed before posting. Caption: community, store, producer names.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 39,
    phase: "Pilot Execution",
    theme: "September month-end close",
    days: [
      {
        isoDate: "2026-09-21",
        steps: [
          {
            title: "Pull September Square data",
            detail: "Largest month of the year expected. Export full CSV for bookkeeper.",
          },
        ],
      },
      {
        isoDate: "2026-09-22",
        steps: [
          {
            title: "QuickBooks September close",
            detail: "Close by Sep 30. Confirm all Local Line invoices entered. Payroll confirmed.",
          },
        ],
      },
      {
        isoDate: "2026-09-23",
        steps: [
          {
            title: "Payroll confirmed for Sep 30",
            detail: "Bridge capital fully recovered by now (invoices #1 and #2 cleared Jun/Jul). Running on operational revenue.",
          },
        ],
      },
      {
        isoDate: "2026-09-24",
        steps: [
          {
            title: "September council report drafted",
            detail: "Highlight: harvest season results, peak week stats, community appreciation event recap.",
          },
        ],
      },
      {
        isoDate: "2026-09-25",
        steps: [
          {
            title: "Send September report — flag any anomalies for council",
            detail: "Any variances vs. budget? Any staff changes? Any producer issues? Be transparent.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 40,
    phase: "Pilot Execution",
    theme: "Pilot #2 brief finalised",
    days: [
      {
        isoDate: "2026-09-28",
        steps: [
          {
            title: "Review Pilot #2 feasibility note with CDA",
            detail: "Has anything changed since the August visit? Any new information from the candidate community?",
          },
        ],
      },
      {
        isoDate: "2026-09-29",
        steps: [
          {
            title: "Finalize Pilot #2 brief document",
            detail: "4 pages: community profile, engagement model, budget estimate (based on Pilot #1 cost basis), timeline, risk factors.",
            actions: [
              {
                type: "copy-ai-prompt",
                label: "Write the Pilot #2 engagement brief",
                content: "Write a 4-page Pilot #2 engagement brief for Headwaters Development Services. Based on our Pilot #1 experience at Deer Lake (6 months of operating a community food store for a First Nations band council in northern Ontario), write a brief covering: (1) Community profile section — criteria and fit for Pilot #2 community, (2) Proposed engagement model — same team structure (practitioner, OM, food handler, bookkeeper, CDA), same tech stack (Square, Local Line, QuickBooks), same 12-month timeline, (3) Budget estimate — based on Pilot #1 cost basis, adjusted for any known differences, (4) Timeline — 16-week Foundation phase, 28-week Pilot Execution, 8-week Year-End Audit, (5) Risk factors and mitigation. Tone: professional, evidence-based, grounded in Pilot #1 learnings.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-09-30",
        steps: [
          {
            title: "Send Pilot #2 brief to practitioner for approval",
            detail: "Allow 48 hours for review. Request specific approval before any community commitments are made.",
          },
        ],
      },
      {
        isoDate: "2026-10-01",
        steps: [
          {
            title: "Practitioner reviews and approves Pilot #2 brief",
            detail: "Practitioner signs off or returns with specific changes. No conditional approvals.",
          },
        ],
      },
      {
        isoDate: "2026-10-02",
        steps: [
          {
            title: "File Pilot #2 brief — begin Pilot #2 contract outreach",
            detail: "The brief is now a live document. CDA begins formal outreach for Pilot #2 engagement.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 41,
    phase: "Pilot Execution",
    theme: "Q3 audit package preparation",
    days: [
      {
        isoDate: "2026-10-05",
        steps: [
          {
            title: "Pull Q3 QuickBooks data export (Jul–Sep)",
            detail: "Export: P&L, balance sheet, AP aging, payroll summary. Three months of data in one package.",
            actions: [
              {
                type: "copy-replit-task-brief",
                label: "Build the quarterly audit export tool",
                content: "In the Headwaters Books app, add a Quarterly Export feature. It should allow the bookkeeper to select a quarter (Q1–Q4) and export a combined package as a single PDF or ZIP containing: (1) P&L by month within the quarter, (2) balance sheet at quarter-end, (3) AP aging at quarter-end, (4) payroll summary by employee for the quarter, and (5) Square reconciliation summary (Square total vs. QB total by month). Each section has a title page. Stack: React + existing Headwaters Books UI. Generate PDF via print-to-PDF or a simple HTML export.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-10-06",
        steps: [
          {
            title: "Reconcile Q3 Square vs. QuickBooks totals",
            detail: "Month by month: Jul, Aug, Sep. Any discrepancy > $10 requires a journal entry explanation.",
          },
        ],
      },
      {
        isoDate: "2026-10-07",
        steps: [
          {
            title: "Prepare Q3 audit package — journal entries, bank rec, invoices",
            detail: "One folder per month: /Q3/Jul, /Q3/Aug, /Q3/Sep. Each folder: bank rec, journal entries, producer invoices paid.",
          },
        ],
      },
      {
        isoDate: "2026-10-08",
        steps: [
          {
            title: "Bookkeeper reviews Q3 package before filing",
            detail: "Bookkeeper sign-off on completeness. Any missing items flagged now, not at year-end.",
          },
        ],
      },
      {
        isoDate: "2026-10-09",
        steps: [
          {
            title: "Q3 audit package filed — sent to practitioner CFO",
            detail: "File in /Finance/Q3-Audit. Email to CFO with the two key numbers: Q3 revenue and Q3 reinvestment accumulation.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 42,
    phase: "Pilot Execution",
    theme: "Financial model updated with Q1–Q3 actuals",
    days: [
      {
        isoDate: "2026-10-12",
        steps: [
          {
            title: "Update the budget model with Q1–Q3 actuals",
            detail: "Every budget line: planned vs. actual. Flag lines where actuals are > 10% above plan.",
          },
        ],
      },
      {
        isoDate: "2026-10-13",
        steps: [
          {
            title: "Variance analysis — which lines are running over or under?",
            detail: "The most important number: cost basis actual vs. plan. If over, what is the cause?",
          },
        ],
      },
      {
        isoDate: "2026-10-14",
        steps: [
          {
            title: "Draft Q3 financial commentary for CFO",
            detail: "2–3 paragraphs: overall picture, key variances explained, Q4 projection.",
            actions: [
              {
                type: "copy-ai-prompt",
                label: "Write the Q3 financial commentary",
                content: "Write a 3-paragraph financial commentary for Q3 (July–September) of a community development engagement. The commentary is addressed to the practitioner's CFO. Cover: (1) overall Q3 financial picture — revenue vs. plan, cost basis vs. plan, one sentence on whether we are on track, (2) key variances — note which budget lines ran over or under and briefly explain why (e.g., higher freight costs in harvest season, summer support hire), (3) Q4 projection — based on Q1–Q3 actuals, what is the full-year outlook? Is the reinvestment reserve on track? Tone: clear, concise, financial-professional.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-10-15",
        steps: [
          {
            title: "Review reinvestment accumulation — on schedule?",
            detail: "Target: 35% reinvestment rate. Calculate actual YTD reinvestment vs. target. Flag if below.",
          },
        ],
      },
      {
        isoDate: "2026-10-16",
        steps: [
          {
            title: "Updated financial model filed and sent to practitioner",
            detail: "Include a one-line executive summary: on track / slightly behind / ahead. No surprises at year-end.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 43,
    phase: "Pilot Execution",
    theme: "Pre-audit documentation sprint",
    days: [
      {
        isoDate: "2026-10-19",
        steps: [
          {
            title: "Compile all contracts: producers, Dryden lease, staff",
            detail: "Every signed contract in /Finance/Contracts. Check that no contract has expired silently.",
          },
        ],
      },
      {
        isoDate: "2026-10-20",
        steps: [
          {
            title: "Confirm all invoices paid and filed in QuickBooks",
            detail: "Run the AP aging report. Any outstanding invoices from Q1–Q3 must be paid or written off with explanation.",
          },
        ],
      },
      {
        isoDate: "2026-10-21",
        steps: [
          {
            title: "Staff records review — hours, payroll, CRA remittances",
            detail: "CRA payroll remittances must be current. Any late remittance from Q1–Q3 must be filed now with interest.",
          },
        ],
      },
      {
        isoDate: "2026-10-22",
        steps: [
          {
            title: "Tech asset register updated with any additions or disposals",
            detail: "Any hardware added or retired since January must be in the register with dates.",
          },
        ],
      },
      {
        isoDate: "2026-10-23",
        steps: [
          {
            title: "Pre-audit checklist signed off by practitioner and bookkeeper",
            detail: "Both sign the checklist. Filed in /Finance/Audit. Any item not completed gets a written explanation.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 44,
    phase: "Pilot Execution",
    theme: "Pilot Execution close-out — transition to Audit phase",
    days: [
      {
        isoDate: "2026-10-26",
        steps: [
          {
            title: "Final Pilot Execution operations summary written",
            detail: "7-month summary: revenue, transactions, SKUs, producers, community members served, staff stability.",
          },
        ],
      },
      {
        isoDate: "2026-10-27",
        steps: [
          {
            title: "Handover brief to Year-End Audit mode",
            detail: "Confirm: store continues operating, OM continues daily rhythm, bookkeeper runs monthly closes.",
          },
        ],
      },
      {
        isoDate: "2026-10-28",
        steps: [
          {
            title: "OM briefed on reduced external pace in Nov–Dec",
            detail: "Store operations don't change. Practitioner availability slightly lower as audit work begins.",
          },
        ],
      },
      {
        isoDate: "2026-10-29",
        steps: [
          {
            title: "Confirm store continues operating through the audit period",
            detail: "The store never closes for audit. Community operations continue. Audit runs in parallel.",
          },
        ],
      },
      {
        isoDate: "2026-10-30",
        steps: [
          {
            title: "Practitioner debrief — personal transition to Year-End Audit phase",
            detail: "Note the three biggest operational wins and three biggest lessons from Pilot Execution. File them.",
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  YEAR-END AUDIT  W45–W52  (Nov 2 – Dec 27, 2026)
  // ══════════════════════════════════════════════════════════

  {
    isoWeek: 45,
    phase: "Year-End Audit",
    theme: "Audit kickoff",
    days: [
      {
        isoDate: "2026-11-02",
        steps: [
          {
            title: "Engage external auditor (or confirm internal review process)",
            detail: "If external: send engagement letter and Q1–Q3 package. If internal: confirm bookkeeper leads with practitioner oversight.",
          },
        ],
      },
      {
        isoDate: "2026-11-03",
        steps: [
          {
            title: "Provide auditor with Q1–Q3 audit package",
            detail: "Full package: QuickBooks export, bank statements, Square settlement reports, payroll records.",
          },
        ],
      },
      {
        isoDate: "2026-11-04",
        steps: [
          {
            title: "Auditor kickoff call — scope, timeline, and document requests",
            detail: "Confirm: what is the auditor's timeline? What additional documents do they need? Who is the day-to-day contact?",
          },
        ],
      },
      {
        isoDate: "2026-11-05",
        steps: [
          {
            title: "Set up audit response tracker",
            detail: "Spreadsheet: auditor request, who owns the response, due date, status. Review weekly.",
          },
        ],
      },
      {
        isoDate: "2026-11-06",
        steps: [
          {
            title: "Begin gathering Year-End documents (October not yet closed)",
            detail: "Start October bank statements, Square report, and payroll run now so nothing surprises you at close.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 46,
    phase: "Year-End Audit",
    theme: "Financial reconciliation — full year",
    days: [
      {
        isoDate: "2026-11-09",
        steps: [
          {
            title: "Bank reconciliation — all 10 months (Jan–Oct)",
            detail: "Every month: QuickBooks closing balance matches bank statement. No unreconciled differences carry forward.",
          },
        ],
      },
      {
        isoDate: "2026-11-10",
        steps: [
          {
            title: "Square settlement vs. QuickBooks — year-to-date check",
            detail: "Square sends a year-to-date summary. Every dollar must be in QuickBooks. Total variance should be $0.",
          },
        ],
      },
      {
        isoDate: "2026-11-11",
        steps: [
          {
            title: "Remembrance Day — store observes; admin work paused",
            detail: "Short-form operations if the community expects the store open. No financial work.",
          },
        ],
      },
      {
        isoDate: "2026-11-12",
        steps: [
          {
            title: "Local Line invoices vs. QuickBooks AP — all producers YTD",
            detail: "Every Local Line invoice must be in QuickBooks as a paid bill. No missing vendors.",
          },
        ],
      },
      {
        isoDate: "2026-11-13",
        steps: [
          {
            title: "Payroll vs. CRA remittances — confirm all filed",
            detail: "Run CRA payroll ledger. Every month must show: remittance filed and cleared. No outstanding balances.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 47,
    phase: "Year-End Audit",
    theme: "Impact report — first draft",
    days: [
      {
        isoDate: "2026-11-16",
        steps: [
          {
            title: "Compile engagement KPIs — full year",
            detail: "Final numbers: total revenue, # transactions, # active producers, # unique SKUs, avg basket size, avg community savings %.",
          },
        ],
      },
      {
        isoDate: "2026-11-17",
        steps: [
          {
            title: "Draft impact report narrative",
            detail: "Sections: The Mission, Who We Served, What We Built, The Numbers, What Comes Next.",
            actions: [
              {
                type: "copy-ai-prompt",
                label: "Draft the Year 1 impact report",
                content: "Write a Year 1 Impact Report for Headwaters Development Services, summarizing 12 months of operating a community food store for a First Nations band council in northern Ontario. Report sections: (1) Our Mission — one clear paragraph on why this work exists, (2) Who We Served — community profile, approximate number of community members who shopped, demographic notes, (3) What We Built — the store, the producer network (list producers), the tech stack, the team, (4) The Numbers — key metrics: total annual revenue, transaction count, active producers, SKU count, average community savings vs. Dryden retail, (5) What Comes Next — Pilot #2 community interest, contract renewal recommendation. Tone: proud but honest, evidence-based, accessible for a community audience and a council boardroom.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-11-18",
        steps: [
          {
            title: "Collect photos and community quotes for the report",
            detail: "Photos: store, staff, producers, community members (with consent forms). Quotes: from community members and the OM.",
          },
        ],
      },
      {
        isoDate: "2026-11-19",
        steps: [
          {
            title: "Design impact report layout (or commission from design team)",
            detail: "Should match the Headwaters brand: dark green, paper cream, amber. 8 pages maximum.",
          },
        ],
      },
      {
        isoDate: "2026-11-20",
        steps: [
          {
            title: "First draft impact report to practitioner for review",
            detail: "48-hour review window. Practitioner marks up: anything factually wrong, anything that should be added.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 48,
    phase: "Year-End Audit",
    theme: "Impact report revision and November close",
    days: [
      {
        isoDate: "2026-11-23",
        steps: [
          {
            title: "Practitioner review of impact report draft",
            detail: "Check: are the numbers accurate? Is the tone right? Are any community members mis-named or mis-quoted?",
          },
        ],
      },
      {
        isoDate: "2026-11-24",
        steps: [
          {
            title: "QuickBooks November close prep",
            detail: "November closes at month-end. Run preliminary close mid-month to catch any issues.",
          },
        ],
      },
      {
        isoDate: "2026-11-25",
        steps: [
          {
            title: "Incorporate practitioner feedback into impact report v2",
            detail: "All factual corrections must be made before sharing with council.",
          },
        ],
      },
      {
        isoDate: "2026-11-26",
        steps: [
          {
            title: "Thanksgiving Day (CAN) — store closed; full rest",
            detail: "Well-earned. The team has run a store for 7+ months. Rest matters.",
          },
        ],
      },
      {
        isoDate: "2026-11-27",
        steps: [
          {
            title: "Impact report v2 circulated to band council",
            detail: "Give council a week to read before the formal presentation. Invite written questions in advance.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 49,
    phase: "Year-End Audit",
    theme: "Council Year-End presentation",
    days: [
      {
        isoDate: "2026-11-30",
        steps: [
          {
            title: "Prepare Year-End presentation deck for council (12 slides)",
            detail: "Slides: Mission recap, Year in numbers, Community impact, Financial summary, Lessons learned, Pilot #2 proposal, Year 2 ask.",
          },
        ],
      },
      {
        isoDate: "2026-12-01",
        steps: [
          {
            title: "Rehearse presentation with OM",
            detail: "OM presents the operations section. Practitioner presents financial and strategic. 30 minutes total, 20 min Q&A.",
          },
        ],
      },
      {
        isoDate: "2026-12-02",
        steps: [
          {
            title: "Council Year-End presentation",
            detail: "Present with confidence. Acknowledge what didn't go as planned. Councils respect honesty.",
          },
        ],
      },
      {
        isoDate: "2026-12-03",
        steps: [
          {
            title: "Council Q&A and feedback session",
            detail: "Record every question. A question not asked in the meeting may appear in the contract renewal discussion.",
          },
        ],
      },
      {
        isoDate: "2026-12-04",
        steps: [
          {
            title: "Post-presentation debrief — note renewal signals",
            detail: "Did the council express intent to renew? Any concerns raised? Any new conditions likely for Year 2?",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 50,
    phase: "Year-End Audit",
    theme: "Contract renewal negotiation",
    days: [
      {
        isoDate: "2026-12-07",
        steps: [
          {
            title: "Review engagement contract for Year 2 renewal terms",
            detail: "What does the renewal clause say? Can the rate be adjusted? What are the notice requirements?",
          },
        ],
      },
      {
        isoDate: "2026-12-08",
        steps: [
          {
            title: "Prepare Year 2 proposal — updated cost basis and ask",
            detail: "Start from the Year 1 cost basis. Apply any known cost increases (CPI, staff raises). Show the updated Scenario B ask.",
            actions: [
              {
                type: "copy-ai-prompt",
                label: "Draft the Year 2 renewal proposal",
                content: "Write a Year 2 contract renewal proposal for Headwaters Development Services to present to a First Nations band council. Year 1 was a 12-month community food store engagement at [monthly rate]. Year 2 should: (1) maintain the same team structure and tech stack, (2) apply a modest cost basis increase for Year 2 (CPI + staff retention), (3) add a Pilot #2 scoping retainer line (optional add-on), (4) include a 6-month and 12-month review milestone, (5) make the reinvestment rate explicit and tie it to Pilot #2 funding. Tone: direct, confident, relationship-preserving. This is a renewal, not a first pitch.",
              },
            ],
          },
        ],
      },
      {
        isoDate: "2026-12-09",
        steps: [
          {
            title: "Practitioner and council Year 2 renewal discussion",
            detail: "Come with 3 points of flexibility and 1 non-negotiable. Know your BATNA before you sit down.",
          },
        ],
      },
      {
        isoDate: "2026-12-10",
        steps: [
          {
            title: "Incorporate council feedback into Year 2 proposal",
            detail: "Turnaround: 24 hours. Councils appreciate responsiveness.",
          },
        ],
      },
      {
        isoDate: "2026-12-11",
        steps: [
          {
            title: "Year 2 proposal submitted to council for formal approval",
            detail: "Council will likely need to vote in a formal meeting. Set a decision date.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 51,
    phase: "Year-End Audit",
    theme: "Year-end financial close",
    days: [
      {
        isoDate: "2026-12-14",
        steps: [
          {
            title: "QuickBooks December preliminary close",
            detail: "Don't wait until Dec 31. Run a preliminary close Dec 14. Catch errors before the holiday week.",
          },
        ],
      },
      {
        isoDate: "2026-12-15",
        steps: [
          {
            title: "Final bank reconciliation — all 12 months confirmed",
            detail: "Every month from Jan to Nov locked. December pending. Year-end balance confirmed.",
          },
        ],
      },
      {
        isoDate: "2026-12-16",
        steps: [
          {
            title: "Confirm all CRA remittances filed for the year",
            detail: "Log every month's remittance confirmation number. File the full log in /Finance/CRA-Remittances.",
          },
        ],
      },
      {
        isoDate: "2026-12-17",
        steps: [
          {
            title: "Year-end journal entries — depreciation, accruals",
            detail: "Depreciate the Year 1 CAPEX (servers, phones, computers). Accrue any outstanding producer invoices.",
          },
        ],
      },
      {
        isoDate: "2026-12-18",
        steps: [
          {
            title: "Year-end package sent to auditor",
            detail: "Full package: all 11 months closed, December preliminary. Auditor confirms receipt and timeline for final report.",
          },
        ],
      },
    ],
  },

  {
    isoWeek: 52,
    phase: "Year-End Audit",
    theme: "Holiday close — Pilot #2 brief sign-off and year-end reflection",
    days: [
      {
        isoDate: "2026-12-21",
        steps: [
          {
            title: "Final impact report published and filed",
            detail: "Distribute to council, band office, and one copy to each producer. This is the Year 1 legacy document.",
          },
        ],
      },
      {
        isoDate: "2026-12-22",
        steps: [
          {
            title: "Pilot #2 brief signed off by practitioner",
            detail: "Final sign-off. The brief is ready to present to the Pilot #2 community council in January.",
          },
        ],
      },
      {
        isoDate: "2026-12-23",
        steps: [
          {
            title: "Store moves to holiday reduced hours",
            detail: "Dec 24–Jan 1: confirm hours with food handler and OM. Community should know the schedule well in advance.",
          },
        ],
      },
      {
        isoDate: "2026-12-24",
        steps: [
          {
            title: "Staff holiday bonuses confirmed and paid",
            detail: "Every team member who completed the year gets a written note from the practitioner. The bonus is secondary to the recognition.",
          },
        ],
      },
      {
        isoDate: "2026-12-25",
        steps: [
          {
            title: "Christmas Day — full rest",
            detail: "The practitioner ran a community store for 12 months while protecting family time. Both are true. Rest today.",
          },
        ],
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getWeek(isoWeek: number): Week | undefined {
  return PLAN_2026.find((w) => w.isoWeek === isoWeek);
}

export function getTodayWeek(): Week | undefined {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  return PLAN_2026.find((w) => w.days.some((d) => d.isoDate === todayStr));
}

export function getTodayDay(): { week: Week; day: Day } | undefined {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  for (const week of PLAN_2026) {
    const day = week.days.find((d) => d.isoDate === todayStr);
    if (day) return { week, day };
  }
  return undefined;
}

export function formatDateRange(week: Week): string {
  const dates = week.days.map((d) => new Date(d.isoDate + "T12:00:00"));
  const first = dates[0];
  const last = dates[dates.length - 1];
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  if (first.getMonth() === last.getMonth()) {
    return `${first.toLocaleDateString("en-CA", { month: "short" })} ${first.getDate()}–${last.getDate()}`;
  }
  return `${first.toLocaleDateString("en-CA", opts)} – ${last.toLocaleDateString("en-CA", opts)}`;
}

export const PHASE_ORDER: Phase[] = ["Foundation", "Pilot Execution", "Year-End Audit"];

export const PHASE_COLORS: Record<Phase, { bg: string; text: string; dot: string }> = {
  Foundation: { bg: "rgba(184,90,62,0.12)", text: "#b85a3e", dot: "#b85a3e" },
  "Pilot Execution": { bg: "rgba(31,61,46,0.15)", text: "#1f3d2e", dot: "#1f3d2e" },
  "Year-End Audit": { bg: "rgba(122,122,110,0.15)", text: "#4a5240", dot: "#7a7a6e" },
};
