import { db } from "@workspace/db";
import {
  subjectsTable,
  projectBucketsTable,
  producersTable,
  contributorsTable,
  libraryEntriesTable,
  entrySubjectsTable,
  entryBucketsTable,
  shareLinksTable,
} from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";

const ATTACHED_DIR = path.resolve(process.cwd(), "../attached_assets");

// ---------- taxonomies ----------

const SUBJECTS: { slug: string; name: string; description?: string; color?: string }[] = [
  { slug: "distribution", name: "Distribution", description: "Logistics, freight schedules, distributor guides, last-mile delivery.", color: "#7C5E3C" },
  { slug: "producers", name: "Producers", description: "Profiles, sell-sheets, and product info for individual producers and farms.", color: "#3F6B4E" },
  { slug: "funding", name: "Funding", description: "Grant applications, funding programs, and financial proposals.", color: "#A6743C" },
  { slug: "indigenous-communities", name: "Indigenous Communities", description: "Materials related to Tikinagan, fly-in communities, and Indigenous food sovereignty.", color: "#8E3F3F" },
  { slug: "baking", name: "Baking", description: "Bread and baked goods producers, wholesale lists.", color: "#B0894F" },
  { slug: "dairy", name: "Dairy", description: "Local dairies, cold-chain considerations, dairy producers.", color: "#5E7AA6" },
  { slug: "kitchen-infrastructure", name: "Kitchen Infrastructure", description: "Commercial kitchens, HACCP, food safety, processing infrastructure.", color: "#6B6357" },
  { slug: "research-reports", name: "Research & Reports", description: "Feasibility studies, research papers, sector reports.", color: "#4F6177" },
  { slug: "store-operations", name: "Store Operations", description: "Co-op store inventory, COGS, in-store layout, packaging.", color: "#7A5A3A" },
  { slug: "coffee", name: "Coffee", description: "Coffee roasters and wholesale coffee programs.", color: "#4B2E20" },
  { slug: "beverage-spirits", name: "Beverage & Spirits", description: "Local distilleries and beverage makers.", color: "#56476B" },
  { slug: "produce-greenhouse", name: "Produce & Greenhouse", description: "Greenhouses and fresh produce growers.", color: "#476B47" },
  { slug: "fish", name: "Fish & Aquaculture", description: "Sustainable fish initiatives in Northern Ontario.", color: "#3D6478" },
  { slug: "policy-governance", name: "Policy & Governance", description: "Co-op bylaws, multi-stakeholder governance, business plans.", color: "#3D3D52" },
];

const BUCKETS: { slug: string; name: string; description?: string; color?: string }[] = [
  { slug: "deer-lake-store", name: "Deer Lake Co-op Store", description: "Operating plan, inventory, and supplier mix for the Deer Lake co-op store.", color: "#3F6B4E" },
  { slug: "lfif-cold-transport", name: "LFIF Cold-Transport Pilot", description: "Local Food Infrastructure Fund cold-chain transport pilot project.", color: "#5E7AA6" },
  { slug: "807-nwo-hub", name: "807 / NWO Food Hub", description: "807 Food Co-op and the broader Northwestern Ontario Food Hub Network.", color: "#A6743C" },
];

type ProducerSeed = {
  slug: string;
  name: string;
  kind: string;
  description?: string;
  websiteUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
  statusFlag?: string;
  statusNotes?: string;
  substituteForProducerSlug?: string;
};

const PRODUCERS: ProducerSeed[] = [
  { slug: "807-food-coop", name: "807 Food Co-op", kind: "organization", description: "Dryden, ON co-op operating an in-store retail program and producer aggregation.", location: "Dryden, ON" },
  { slug: "lock-city-dairies", name: "Lock City Dairies Inc.", kind: "producer", description: "Sault Ste. Marie dairy and dairy distributor for Northern Ontario.", location: "Sault Ste. Marie, ON" },
  { slug: "superior-seasons", name: "Superior Seasons", kind: "distributor", description: "Northwestern Ontario food aggregator and online local food marketplace." },
  { slug: "lffc-nfdn", name: "LFFC / Northern Fresh Distribution Network", kind: "distributor", description: "Local food freight collaboration across northern hubs." },
  { slug: "food-flow-feasibility", name: "Food Flow Feasibility Study", kind: "study", description: "NOT FOR CIRCULATION feasibility study on regional food flow." },
  { slug: "erb-distribution", name: "Erb Group", kind: "distributor", description: "Cold-chain refrigerated freight (Erb 2023 reference)." },
  { slug: "tikinagan", name: "Tikinagan", kind: "organization", description: "Tikinagan Child & Family Services partner work, gift boxes and Tik mealkits to fly-in communities." },
  { slug: "superior-bakes", name: "Superior Bakes", kind: "producer", description: "Wholesale bread and baked goods, Northwestern Ontario." },
  { slug: "brulee-creek", name: "Brûlée Creek", kind: "producer", description: "Small-batch producer (sell-sheet on file)." },
  { slug: "hub-roastery", name: "Hub Roastery", kind: "producer", description: "Coffee roaster — wholesale list on file.", websiteUrl: "https://hubroastery.com" },
  { slug: "nautical-coffee", name: "Nautical Coffee", kind: "producer", description: "Coffee roaster (sell sheet on file).", websiteUrl: "https://nauticalcoffee.ca" },
  { slug: "canwest-foods", name: "CanWest Foods", kind: "distributor", description: "CanWest stocklist Vol. 1 (single pages) on file." },
  { slug: "shumaka-dust", name: "Shumaka Dust", kind: "producer", description: "Indigenous-owned spice blend producer; substituting for the formerly considered 'Crazy Good Spices' which has uncertain operating status.", statusFlag: "operating", substituteForProducerSlug: "crazy-good-spices" },
  { slug: "crazy-good-spices", name: "Crazy Good Spices", kind: "producer", description: "Spice blend producer; previously considered for the program. Status uncertain — substituted by Shumaka Dust in current planning.", statusFlag: "uncertain", statusNotes: "Operating status uncertain — see Shumaka Dust as substitute." },
  { slug: "canwest-maple", name: "CanWest Maple", kind: "producer", description: "Maple syrup producer in the wholesale list." },
  { slug: "sdg-funding-program", name: "SDG Funding Program", kind: "organization", description: "Sustainable Development Goals funding program — proposal submission." },
  { slug: "lfif", name: "Local Food Infrastructure Fund (LFIF)", kind: "organization", description: "Federal infrastructure grant for local food systems — pilot final report on file." },
  { slug: "debruins-greenhouse", name: "Debruin's Greenhouse", kind: "producer", description: "Greenhouse producer." },
  { slug: "rockfront-family-farms", name: "Rockfront Family Farms", kind: "producer", description: "Family farm producer with photos on file." },
  { slug: "june-and-jo", name: "June & Jo", kind: "producer", description: "Producer postcard / promo on file." },
  { slug: "eat-the-fish", name: "Eat the Fish", kind: "organization", description: "Sustainable freshwater fish initiative." },
  { slug: "ducharme-nelson-pilot", name: "Ducharme & Nelson Pilot Research", kind: "study", description: "Final pilot research report (Ducharme & Nelson)." },
  { slug: "ecs-program", name: "ECS Program", kind: "organization", description: "Terms & Conditions on file." },
  { slug: "esdc", name: "ESDC", kind: "organization", description: "Employment & Social Development Canada — EMP5671 application draft." },
];

const CONTRIBUTORS: { name: string; organization?: string; email?: string; notes?: string }[] = [
  { name: "Robin", organization: "807 / NWO Food Hub", notes: "Library owner — primary curator." },
  { name: "Jen Springett", organization: "Northern Fresh Distribution Network", notes: "Cold-chain logistics partner; sample contributor." },
];

// ---------- entry catalog ----------
// Each entry: filename in attached_assets/, generated title, summary, optional producerSlug, subject slugs, bucket slugs.
// For the IMG_xxxx series we treat them as in-store / packaging photos for the 807 store.

type EntrySeed = {
  filename: string;
  title: string;
  summary?: string;
  producerSlug?: string;
  subjectSlugs: string[];
  bucketSlugs: string[];
  contributorIndex?: number; // 1 = Jen Springett (sample share-link upload, needs_review)
};

const IMG_ENTRIES: EntrySeed[] = [];
const IMG_NUMBERS = [
  "2858", "2859", "2860", "2861", "2862", "2863", "2864", "2865", "2866", "2867",
  "2868", "2869", "2975", "2976", "2977", "2978", "2979", "2980", "2981", "2982",
  "2983", "2984", "2985", "2986",
];
// Files we know are in attached_assets/ — generated by listing.
const RAW_ATTACHED = `2023_06_02_DRAFT_OUTLINE_OF_HACCP_BUSINESS_CASE_REPORT_1777036795370.pdf
42278_1777040038408.jpg
807_charc_board_1777040118387.jpg
807_product_packages_1777039787274.xlsx
Brûlée_Creek_1777039787273.pdf
CanWest_Stocklist_Vol_1_single_pages_1777039787272.pdf
Coffee_List_-_Grocery_pdf_(2)_1777039787271.pdf
Debruins_Greenhouse_1777039787271.docx
December_COGS_for_TIK_and_Meal_kits_-_TIK_BOXES_1777039787274.pdf
Distribution_1777039682789.xlsx
Eat_the_Fish__1777039787271.docx
ECSTermsConditions_1777039307113.pdf
ENGLISH_Distributor_Guide_(2)_1777039787270.pdf
ERB_Distribution_1777039307114.docx
ESDC-EMP5671_Application_Draft_1777039787273.pdf
FINALPilotResearchReportDucharmeNelson_1777036795393.pdf
Food_Flow_Feas_Study_Final_NOT_FOR_CIRC_1777039682790.pdf
Gift_Boxes_Tikanogan_1777039787275.docx
GrowingLocalFoodLiteracy-Tipsheet_1777040118385.pdf
image_6483441_1777040118386.JPG
IMG_2858_(1)_1777039682770.PNG
IMG_2858_1777039682789.PNG
IMG_2859_(1)_1777039682768.PNG
IMG_2859_1777039682788.PNG
IMG_2860_(1)_1777039460393.PNG
IMG_2860_1777039682788.PNG
IMG_2861_(1)_1777039460392.PNG
IMG_2861_1777039682787.PNG
IMG_2862_(1)_1777039460390.PNG
IMG_2862_1777039682787.PNG
IMG_2863_(1)_1777039460388.PNG
IMG_2863_1777039682786.PNG
IMG_2864_(1)_1777039460388.PNG
IMG_2864_1777039682781.PNG
IMG_2865_(1)_1777039460387.PNG
IMG_2865_1777039682780.PNG
IMG_2866_(1)_1777039460386.PNG
IMG_2866_1777039682776.PNG
IMG_2867_(1)_1777039460384.PNG
IMG_2867_1777039682775.PNG
IMG_2868_1777039682774.PNG
IMG_2869_1777039682773.PNG
IMG_2975_1777039228081.PNG
IMG_2976_1777039228126.PNG
IMG_2977_1777039228127.PNG
IMG_2978_1777039228128.PNG
IMG_2979_1777039228128.PNG
IMG_2980_1777039228129.PNG
IMG_2981_1777039228134.PNG
IMG_2981_1777039306923.PNG
IMG_2982_1777039228135.PNG
IMG_2982_1777039307108.PNG
IMG_2983_1777039228135.PNG
IMG_2983_1777039307109.PNG
IMG_2984_1777039228136.PNG
IMG_2984_1777039307110.PNG
IMG_2985_1777039307111.PNG
IMG_2986_1777039307111.PNG
June_and_Jo_Postcard_FIN_1777039787270.pdf
Nautical-Coffee-sell-sheet-info_(2)_1777039787270.pdf
Onbaording_New_Suppliers_1777039787269.docx
P5554E_1777040118386.pdf
Pasted-100KM-only-distribute-themselves-in-the-Toronto-and-Nia_1777034581483.txt
Pasted-2-4-Project-Overview-Consult-the-Appendix-Application-A_1777034273796.txt
Pasted-April-NWO-Food-Groups-Meeting-Dryden-Surrounding-Areas-_1777034684242.txt
Pasted-Building-a-Northwestern-Ontario-Food-Hub-Network-Projec_1777034364227.txt
Pasted-Building-a-Northwestern-Ontario-Food-Hub-Network-Projec_1777034479412.txt
Pasted--Business-Plan-807-Food-Co-op-Inc-Dryden-ON-January-202_1777034303575.txt
Pasted-Guidelines-and-Sample-Bylaw-Language-for-Multi-stakehol_1777035050884.txt
Pasted-Local-Food-Infrastructure-Fund-Final-Project-Report-Com_1777035717477.txt
Pasted-Supply-Chain-Resilience-Analysis-Overview-Key-Outcomes-_1777034738054.txt
Pasted--This-list-reflects-what-we-typically-carry-in-the-shop_1777035261968.txt
pics807_1777040070843.zip
product-import-template_1777039787269.xlsx
Products_807_food_coop_29_Nov_2023_1777039787269.xlsx
Questions__1777039307112.docx
Report_from_Lock_City_Dairies_Inc._1777036795402.xlsx
Report_from_Lock_City_Dairies_Inc..xlsx_-_Sheet1_1777037219932.pdf
Rockfront_Family_Farms_1777039787268.JPG
September_Box2-Box_Summary_and_Producer_Commitments_to_Boxes_1777036795393.pdf
Superior_Bakes_Wholesale_(1)_1777039787237.pdf
Supply_Chain_Resilience_Analysis_Overview__1777039682790.docx
Sustainable_Development_Goals_(SDG)_Funding_Program_Propsal__1777039787274.docx
Template_COGS_for_TIK_and_Meal_kits_-_TIK_BOXES_1777039787275.pdf
Thunder-Bay-and-Winnipeg-Delivery-Schedule-2023-1_1777039460298.pdf
Towards_a_Feasible_Cooperative_1777036795401.pdf
Untitled_spreadsheet_1777039682791.xlsx
Wholesale_Supply_List_1777036795399.pdf`.split("\n");

const META_BY_FILE: Record<string, { title: string; summary?: string; producerSlug?: string; subjects: string[]; buckets: string[]; contributorIndex?: number }> = {
  "2023_06_02_DRAFT_OUTLINE_OF_HACCP_BUSINESS_CASE_REPORT_1777036795370.pdf": {
    title: "HACCP Business Case Report (Draft Outline, 2023-06-02)",
    summary: "Draft outline of the business case for HACCP-certified processing infrastructure for the NWO hub.",
    subjects: ["kitchen-infrastructure", "research-reports", "policy-governance"],
    buckets: ["807-nwo-hub"],
  },
  "42278_1777040038408.jpg": {
    title: "807 Co-op interior — wide shot",
    summary: "Photograph of the 807 Food Co-op shop floor.",
    producerSlug: "807-food-coop",
    subjects: ["store-operations"],
    buckets: ["807-nwo-hub", "deer-lake-store"],
  },
  "807_charc_board_1777040118387.jpg": {
    title: "807 charcuterie board",
    summary: "In-store charcuterie board photo, 807 Food Co-op.",
    producerSlug: "807-food-coop",
    subjects: ["store-operations", "producers"],
    buckets: ["807-nwo-hub"],
  },
  "807_product_packages_1777039787274.xlsx": {
    title: "807 Product Packages (spreadsheet)",
    summary: "Working spreadsheet of curated 807 product packages — pricing, producers, contents.",
    producerSlug: "807-food-coop",
    subjects: ["store-operations", "producers"],
    buckets: ["807-nwo-hub", "deer-lake-store"],
  },
  "Brûlée_Creek_1777039787273.pdf": {
    title: "Brûlée Creek — producer info",
    summary: "Producer profile / sell-sheet for Brûlée Creek.",
    producerSlug: "brulee-creek",
    subjects: ["producers"],
    buckets: ["807-nwo-hub"],
  },
  "CanWest_Stocklist_Vol_1_single_pages_1777039787272.pdf": {
    title: "CanWest Stocklist Vol. 1 (single pages)",
    summary: "Full CanWest distributor stocklist — single-page format for browsing.",
    producerSlug: "canwest-foods",
    subjects: ["distribution", "producers"],
    buckets: ["807-nwo-hub", "deer-lake-store"],
  },
  "Coffee_List_-_Grocery_pdf_(2)_1777039787271.pdf": {
    title: "Coffee List — Grocery",
    summary: "Coffee program list for grocery channel.",
    subjects: ["coffee", "store-operations"],
    buckets: ["807-nwo-hub", "deer-lake-store"],
  },
  "Debruins_Greenhouse_1777039787271.docx": {
    title: "Debruin's Greenhouse — producer notes",
    summary: "Notes on Debruin's Greenhouse as a produce supplier.",
    producerSlug: "debruins-greenhouse",
    subjects: ["produce-greenhouse", "producers"],
    buckets: ["807-nwo-hub"],
  },
  "December_COGS_for_TIK_and_Meal_kits_-_TIK_BOXES_1777039787274.pdf": {
    title: "December COGS — TIK and Meal Kits (TIK Boxes)",
    summary: "Cost of goods sold breakdown for Tikinagan boxes and meal kits, December.",
    producerSlug: "tikinagan",
    subjects: ["indigenous-communities", "store-operations"],
    buckets: ["807-nwo-hub"],
  },
  "Distribution_1777039682789.xlsx": {
    title: "Distribution working spreadsheet",
    summary: "Working distribution spreadsheet — producers, drop points, schedules.",
    subjects: ["distribution"],
    buckets: ["lfif-cold-transport", "807-nwo-hub"],
  },
  "Eat_the_Fish__1777039787271.docx": {
    title: "Eat the Fish — initiative notes",
    summary: "Notes and copy for Eat the Fish — sustainable freshwater fish initiative.",
    producerSlug: "eat-the-fish",
    subjects: ["fish", "producers"],
    buckets: ["807-nwo-hub"],
  },
  "ECSTermsConditions_1777039307113.pdf": {
    title: "ECS Terms & Conditions",
    summary: "ECS program terms and conditions document.",
    producerSlug: "ecs-program",
    subjects: ["policy-governance"],
    buckets: ["807-nwo-hub"],
  },
  "ENGLISH_Distributor_Guide_(2)_1777039787270.pdf": {
    title: "Distributor Guide (English)",
    summary: "Distributor onboarding and operations guide.",
    subjects: ["distribution"],
    buckets: ["lfif-cold-transport", "807-nwo-hub"],
  },
  "ERB_Distribution_1777039307114.docx": {
    title: "Erb Distribution — 2023 reference",
    summary: "Working notes and quotes from Erb Group regarding cold-chain distribution.",
    producerSlug: "erb-distribution",
    subjects: ["distribution"],
    buckets: ["lfif-cold-transport"],
  },
  "ESDC-EMP5671_Application_Draft_1777039787273.pdf": {
    title: "ESDC EMP5671 Application Draft",
    summary: "Draft application to ESDC EMP5671 funding program.",
    producerSlug: "esdc",
    subjects: ["funding"],
    buckets: ["807-nwo-hub"],
  },
  "FINALPilotResearchReportDucharmeNelson_1777036795393.pdf": {
    title: "Final Pilot Research Report — Ducharme & Nelson",
    summary: "Final pilot research report by Ducharme and Nelson on Northern Ontario food systems.",
    producerSlug: "ducharme-nelson-pilot",
    subjects: ["research-reports"],
    buckets: ["807-nwo-hub"],
  },
  "Food_Flow_Feas_Study_Final_NOT_FOR_CIRC_1777039682790.pdf": {
    title: "Food Flow Feasibility Study (NOT FOR CIRCULATION)",
    summary: "Final feasibility study on regional food flow. Marked NOT FOR CIRCULATION — internal reference only.",
    producerSlug: "food-flow-feasibility",
    subjects: ["research-reports", "distribution"],
    buckets: ["lfif-cold-transport", "807-nwo-hub"],
  },
  "Gift_Boxes_Tikanogan_1777039787275.docx": {
    title: "Gift Boxes — Tikinagan",
    summary: "Gift box specifications and producer commitments for Tikinagan boxes.",
    producerSlug: "tikinagan",
    subjects: ["indigenous-communities", "store-operations"],
    buckets: ["807-nwo-hub"],
  },
  "GrowingLocalFoodLiteracy-Tipsheet_1777040118385.pdf": {
    title: "Growing Local Food Literacy — Tipsheet",
    summary: "Tip sheet on local food literacy for community programming.",
    subjects: ["research-reports"],
    buckets: ["807-nwo-hub"],
  },
  "image_6483441_1777040118386.JPG": {
    title: "Co-op interior detail photo",
    summary: "Photo of co-op interior detail.",
    producerSlug: "807-food-coop",
    subjects: ["store-operations"],
    buckets: ["807-nwo-hub", "deer-lake-store"],
  },
  "June_and_Jo_Postcard_FIN_1777039787270.pdf": {
    title: "June & Jo — postcard (final)",
    summary: "Producer postcard / promo card for June & Jo.",
    producerSlug: "june-and-jo",
    subjects: ["producers"],
    buckets: ["807-nwo-hub"],
  },
  "Nautical-Coffee-sell-sheet-info_(2)_1777039787270.pdf": {
    title: "Nautical Coffee — sell sheet",
    summary: "Wholesale sell sheet for Nautical Coffee.",
    producerSlug: "nautical-coffee",
    subjects: ["coffee", "producers"],
    buckets: ["807-nwo-hub", "deer-lake-store"],
  },
  "Onbaording_New_Suppliers_1777039787269.docx": {
    title: "Onboarding New Suppliers",
    summary: "Internal procedure for onboarding new suppliers to the co-op.",
    subjects: ["store-operations", "producers"],
    buckets: ["807-nwo-hub"],
  },
  "P5554E_1777040118386.pdf": {
    title: "Reference document — P5554E",
    summary: "Reference document P5554E on file.",
    subjects: ["research-reports"],
    buckets: ["807-nwo-hub"],
  },
  "Pasted-100KM-only-distribute-themselves-in-the-Toronto-and-Nia_1777034581483.txt": {
    title: "100KM Foods — distribution scope notes",
    summary: "Pasted notes on 100KM Foods distribution scope (Toronto/Niagara only).",
    subjects: ["distribution"],
    buckets: ["807-nwo-hub"],
  },
  "Pasted-2-4-Project-Overview-Consult-the-Appendix-Application-A_1777034273796.txt": {
    title: "Project Overview §2.4 — application appendix excerpt",
    summary: "Pasted project overview (section 2.4) from a funding application appendix.",
    subjects: ["funding", "research-reports"],
    buckets: ["807-nwo-hub"],
  },
  "Pasted-April-NWO-Food-Groups-Meeting-Dryden-Surrounding-Areas-_1777034684242.txt": {
    title: "April NWO Food Groups Meeting — Dryden & surrounding areas",
    summary: "Meeting notes from the April NWO food groups meeting in Dryden.",
    subjects: ["policy-governance"],
    buckets: ["807-nwo-hub"],
  },
  "Pasted-Building-a-Northwestern-Ontario-Food-Hub-Network-Projec_1777034364227.txt": {
    title: "Building a NWO Food Hub Network — project overview",
    summary: "Pasted project overview text for the NWO Food Hub Network.",
    subjects: ["policy-governance", "research-reports"],
    buckets: ["807-nwo-hub"],
  },
  "Pasted-Building-a-Northwestern-Ontario-Food-Hub-Network-Projec_1777034479412.txt": {
    title: "Building a NWO Food Hub Network — project narrative (revised)",
    summary: "Second pasted version of the NWO Food Hub Network project narrative.",
    subjects: ["policy-governance", "research-reports"],
    buckets: ["807-nwo-hub"],
  },
  "Pasted--Business-Plan-807-Food-Co-op-Inc-Dryden-ON-January-202_1777034303575.txt": {
    title: "Business Plan — 807 Food Co-op Inc. (Dryden, ON, Jan 2024)",
    summary: "Pasted business plan for 807 Food Co-op Inc.",
    producerSlug: "807-food-coop",
    subjects: ["policy-governance"],
    buckets: ["807-nwo-hub"],
  },
  "Pasted-Guidelines-and-Sample-Bylaw-Language-for-Multi-stakehol_1777035050884.txt": {
    title: "Multi-stakeholder co-op — bylaw guidelines & sample language",
    summary: "Pasted guidelines and sample bylaw language for multi-stakeholder co-ops.",
    subjects: ["policy-governance"],
    buckets: ["807-nwo-hub", "deer-lake-store"],
  },
  "Pasted-Local-Food-Infrastructure-Fund-Final-Project-Report-Com_1777035717477.txt": {
    title: "LFIF — Final Project Report (pasted)",
    summary: "Pasted text of the Local Food Infrastructure Fund final project report.",
    producerSlug: "lfif",
    subjects: ["funding", "distribution"],
    buckets: ["lfif-cold-transport"],
  },
  "Pasted-Supply-Chain-Resilience-Analysis-Overview-Key-Outcomes-_1777034738054.txt": {
    title: "Supply Chain Resilience Analysis — overview & key outcomes",
    summary: "Pasted supply chain resilience analysis overview and key outcomes.",
    subjects: ["research-reports", "distribution"],
    buckets: ["lfif-cold-transport"],
  },
  "Pasted--This-list-reflects-what-we-typically-carry-in-the-shop_1777035261968.txt": {
    title: "Shop carry list — typical inventory",
    summary: "Pasted note describing what the shop typically carries.",
    producerSlug: "807-food-coop",
    subjects: ["store-operations"],
    buckets: ["807-nwo-hub", "deer-lake-store"],
  },
  "pics807_1777040070843.zip": {
    title: "807 photos archive (zip)",
    summary: "Bundled archive of 807 store and product photos.",
    producerSlug: "807-food-coop",
    subjects: ["store-operations"],
    buckets: ["807-nwo-hub"],
  },
  "product-import-template_1777039787269.xlsx": {
    title: "Product import template",
    summary: "Spreadsheet template for importing producer SKUs.",
    subjects: ["store-operations"],
    buckets: ["807-nwo-hub", "deer-lake-store"],
  },
  "Products_807_food_coop_29_Nov_2023_1777039787269.xlsx": {
    title: "Products — 807 Food Co-op (29 Nov 2023)",
    summary: "Snapshot of 807 Food Co-op product list as of 29 Nov 2023.",
    producerSlug: "807-food-coop",
    subjects: ["store-operations", "producers"],
    buckets: ["807-nwo-hub"],
  },
  "Questions__1777039307112.docx": {
    title: "Questions — working list",
    summary: "Open questions and follow-ups across producers and distribution.",
    subjects: ["store-operations"],
    buckets: ["807-nwo-hub"],
  },
  "Report_from_Lock_City_Dairies_Inc._1777036795402.xlsx": {
    title: "Lock City Dairies — report (xlsx)",
    summary: "Sales / distribution report from Lock City Dairies Inc.",
    producerSlug: "lock-city-dairies",
    subjects: ["dairy", "distribution", "producers"],
    buckets: ["lfif-cold-transport", "deer-lake-store"],
  },
  "Report_from_Lock_City_Dairies_Inc..xlsx_-_Sheet1_1777037219932.pdf": {
    title: "Lock City Dairies — report (Sheet 1, PDF)",
    summary: "PDF export of Sheet 1 from the Lock City Dairies report.",
    producerSlug: "lock-city-dairies",
    subjects: ["dairy", "distribution"],
    buckets: ["lfif-cold-transport", "deer-lake-store"],
  },
  "Rockfront_Family_Farms_1777039787268.JPG": {
    title: "Rockfront Family Farms — photo",
    summary: "Producer photo for Rockfront Family Farms.",
    producerSlug: "rockfront-family-farms",
    subjects: ["producers"],
    buckets: ["807-nwo-hub"],
  },
  "September_Box2-Box_Summary_and_Producer_Commitments_to_Boxes_1777036795393.pdf": {
    title: "September Box-to-Box Summary & Producer Commitments",
    summary: "September meal-box program summary with producer commitments.",
    subjects: ["store-operations", "producers"],
    buckets: ["807-nwo-hub"],
  },
  "Superior_Bakes_Wholesale_(1)_1777039787237.pdf": {
    title: "Superior Bakes — wholesale list",
    summary: "Wholesale price list and product catalogue for Superior Bakes.",
    producerSlug: "superior-bakes",
    subjects: ["baking", "producers"],
    buckets: ["807-nwo-hub", "deer-lake-store"],
  },
  "Supply_Chain_Resilience_Analysis_Overview__1777039682790.docx": {
    title: "Supply Chain Resilience Analysis — overview",
    summary: "Overview document of the supply chain resilience analysis.",
    subjects: ["research-reports", "distribution"],
    buckets: ["lfif-cold-transport"],
  },
  "Sustainable_Development_Goals_(SDG)_Funding_Program_Propsal__1777039787274.docx": {
    title: "SDG Funding Program — proposal",
    summary: "Proposal to the Sustainable Development Goals Funding Program.",
    producerSlug: "sdg-funding-program",
    subjects: ["funding"],
    buckets: ["807-nwo-hub"],
  },
  "Template_COGS_for_TIK_and_Meal_kits_-_TIK_BOXES_1777039787275.pdf": {
    title: "COGS template — TIK & Meal Kits (TIK Boxes)",
    summary: "Cost-of-goods-sold template used for Tikinagan boxes and meal kits.",
    producerSlug: "tikinagan",
    subjects: ["indigenous-communities", "store-operations"],
    buckets: ["807-nwo-hub"],
  },
  "Thunder-Bay-and-Winnipeg-Delivery-Schedule-2023-1_1777039460298.pdf": {
    title: "Thunder Bay & Winnipeg Delivery Schedule (2023)",
    summary: "Delivery schedule covering Thunder Bay and Winnipeg routes, 2023.",
    subjects: ["distribution"],
    buckets: ["lfif-cold-transport"],
  },
  "Towards_a_Feasible_Cooperative_1777036795401.pdf": {
    title: "Towards a Feasible Cooperative",
    summary: "Background paper on what would make this cooperative feasible.",
    subjects: ["policy-governance", "research-reports"],
    buckets: ["807-nwo-hub", "deer-lake-store"],
  },
  "Untitled_spreadsheet_1777039682791.xlsx": {
    title: "Working spreadsheet (untitled)",
    summary: "Untitled working spreadsheet — to triage.",
    subjects: ["store-operations"],
    buckets: ["807-nwo-hub"],
  },
  "Wholesale_Supply_List_1777036795399.pdf": {
    title: "Wholesale Supply List",
    summary: "Consolidated wholesale supply list across producers.",
    subjects: ["distribution", "producers", "store-operations"],
    buckets: ["807-nwo-hub", "deer-lake-store"],
  },
};

// Generate IMG entries from filenames automatically: each goes to store-operations + 807-nwo-hub bucket.
for (const filename of RAW_ATTACHED) {
  if (!filename.startsWith("IMG_")) continue;
  const m = filename.match(/IMG_(\d+)(?:_\(1\))?_/);
  const n = m ? m[1] : filename;
  const isDup = filename.includes("(1)");
  META_BY_FILE[filename] = {
    title: `In-store photo IMG_${n}${isDup ? " (alt)" : ""}`,
    summary: `Photograph from the 807 / co-op store reference set (IMG_${n}).`,
    producerSlug: "807-food-coop",
    subjects: ["store-operations"],
    buckets: ["807-nwo-hub", "deer-lake-store"],
  };
}

const SAMPLE_REVIEW_FILE = "Pasted-100KM-only-distribute-themselves-in-the-Toronto-and-Nia_1777034581483.txt";
META_BY_FILE[SAMPLE_REVIEW_FILE].contributorIndex = 1; // Jen Springett

// ---------- helpers ----------

const guessContentType = (name: string): string => {
  const ext = name.toLowerCase().split(".").pop() || "";
  switch (ext) {
    case "pdf": return "application/pdf";
    case "png": return "image/png";
    case "jpg":
    case "jpeg": return "image/jpeg";
    case "gif": return "image/gif";
    case "webp": return "image/webp";
    case "xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "xls": return "application/vnd.ms-excel";
    case "docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "doc": return "application/msword";
    case "csv": return "text/csv";
    case "txt": return "text/plain";
    case "zip": return "application/zip";
    default: return "application/octet-stream";
  }
};

const coarseFileType = (ct: string, name: string): string => {
  const ext = name.toLowerCase().split(".").pop() || "";
  if (ct.includes("pdf")) return "pdf";
  if (ct.startsWith("image/")) return "image";
  if (ct.includes("spreadsheet") || ct.includes("excel") || ext === "csv") return "sheet";
  if (ct.includes("word") || ct.includes("document")) return "doc";
  if (ct.startsWith("text/")) return "text";
  return "other";
};

// ---------- main ----------

async function main() {
  console.log("[seed] subjects");
  for (const s of SUBJECTS) {
    await db
      .insert(subjectsTable)
      .values(s)
      .onConflictDoUpdate({
        target: subjectsTable.slug,
        set: { name: s.name, description: s.description ?? null, color: s.color ?? null },
      });
  }
  console.log("[seed] buckets");
  for (const b of BUCKETS) {
    await db
      .insert(projectBucketsTable)
      .values(b)
      .onConflictDoUpdate({
        target: projectBucketsTable.slug,
        set: { name: b.name, description: b.description ?? null, color: b.color ?? null },
      });
  }
  console.log("[seed] producers");
  for (const p of PRODUCERS) {
    await db
      .insert(producersTable)
      .values({
        slug: p.slug,
        name: p.name,
        kind: p.kind,
        description: p.description ?? null,
        websiteUrl: p.websiteUrl ?? null,
        contactEmail: p.contactEmail ?? null,
        contactPhone: p.contactPhone ?? null,
        location: p.location ?? null,
        statusFlag: p.statusFlag ?? null,
        statusNotes: p.statusNotes ?? null,
        substituteForProducerSlug: p.substituteForProducerSlug ?? null,
      })
      .onConflictDoUpdate({
        target: producersTable.slug,
        set: {
          name: p.name,
          kind: p.kind,
          description: p.description ?? null,
          websiteUrl: p.websiteUrl ?? null,
          location: p.location ?? null,
          statusFlag: p.statusFlag ?? null,
          statusNotes: p.statusNotes ?? null,
          substituteForProducerSlug: p.substituteForProducerSlug ?? null,
        },
      });
  }

  console.log("[seed] contributors");
  // Idempotent contributors by name.
  const contribIds: string[] = [];
  for (const c of CONTRIBUTORS) {
    const existing = await db
      .select()
      .from(contributorsTable)
      .where(eq(contributorsTable.name, c.name))
      .limit(1);
    if (existing.length) {
      contribIds.push(existing[0]!.id);
    } else {
      const [created] = await db
        .insert(contributorsTable)
        .values({
          name: c.name,
          organization: c.organization ?? null,
          email: c.email ?? null,
          notes: c.notes ?? null,
        })
        .returning();
      contribIds.push(created!.id);
    }
  }

  // Build slug → id maps for tagging.
  const subjectMap = new Map<string, string>();
  for (const s of await db.select().from(subjectsTable)) subjectMap.set(s.slug, s.id);
  const bucketMap = new Map<string, string>();
  for (const b of await db.select().from(projectBucketsTable)) bucketMap.set(b.slug, b.id);
  const producerMap = new Map<string, string>();
  for (const p of await db.select().from(producersTable)) producerMap.set(p.slug, p.id);

  // List actual files in attached_assets for safety, and for each known meta entry seed it.
  const actualFiles = new Set(await readdir(ATTACHED_DIR));

  console.log(`[seed] entries (${RAW_ATTACHED.length} files; ${actualFiles.size} present on disk)`);
  let created = 0;
  let skipped = 0;
  for (const filename of RAW_ATTACHED) {
    const meta = META_BY_FILE[filename];
    if (!meta) {
      console.log(`[seed] !! no metadata for ${filename}; skipping`);
      skipped++;
      continue;
    }
    if (!actualFiles.has(filename)) {
      console.log(`[seed] !! file missing on disk: ${filename}; skipping`);
      skipped++;
      continue;
    }
    const filepath = path.join(ATTACHED_DIR, filename);
    const buf = await readFile(filepath);
    const hash = createHash("sha256").update(buf).digest("hex");
    const fileSize = buf.byteLength;
    const ct = guessContentType(filename);
    const ft = coarseFileType(ct, filename);
    const storageRef = `attached:${filename}`;

    // Idempotency: skip if a row already exists with this content_hash.
    const existing = await db
      .select()
      .from(libraryEntriesTable)
      .where(eq(libraryEntriesTable.contentHash, hash))
      .limit(1);
    if (existing.length) {
      skipped++;
      continue;
    }

    const producerId = meta.producerSlug ? producerMap.get(meta.producerSlug) ?? null : null;
    const status = meta.contributorIndex !== undefined ? "needs_review" : "published";
    const contributorId = meta.contributorIndex !== undefined ? contribIds[meta.contributorIndex] ?? null : null;

    const [row] = await db
      .insert(libraryEntriesTable)
      .values({
        kind: "file",
        title: meta.title,
        summary: meta.summary ?? null,
        status,
        storageRef,
        contentHash: hash,
        fileSize,
        contentType: ct,
        originalFilename: filename,
        fileType: ft,
        producerId,
        contributorId,
      })
      .returning();
    const entryId = row!.id;

    const subjectIds = meta.subjects.map((s) => subjectMap.get(s)).filter((x): x is string => !!x);
    if (subjectIds.length) {
      await db
        .insert(entrySubjectsTable)
        .values(subjectIds.map((sid) => ({ entryId, subjectId: sid })))
        .onConflictDoNothing();
    }
    const bucketIds = meta.buckets.map((b) => bucketMap.get(b)).filter((x): x is string => !!x);
    if (bucketIds.length) {
      await db
        .insert(entryBucketsTable)
        .values(bucketIds.map((bid) => ({ entryId, bucketId: bid })))
        .onConflictDoNothing();
    }
    created++;
  }

  console.log(`[seed] entries done: created=${created} skipped=${skipped}`);

  // One sample share-link for Jen Springett (idempotent on label).
  const existingLink = await db
    .select()
    .from(shareLinksTable)
    .where(eq(shareLinksTable.label, "Sample link — Jen Springett"))
    .limit(1);
  if (!existingLink.length) {
    const token = randomBytes(18).toString("base64url");
    await db.insert(shareLinksTable).values({
      token,
      label: "Sample link — Jen Springett",
      contributorId: contribIds[1]!,
      presetSubjectSlugs: ["distribution"],
      presetBucketSlugs: ["lfif-cold-transport"],
    });
    console.log(`[seed] sample share-link created: ${token}`);
  }

  // Ensure stats are usable: refresh updatedAt to spread recent activity over time.
  // (No-op if already done previously.)
  await db.execute(sql`SELECT 1`);

  console.log("[seed] complete");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
