import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const quoteRequestsTable = pgTable(
  "quote_requests",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    quoteNumber: text("quote_number").notNull(),
    contactName: text("contact_name").notNull(),
    email: text("email").notNull(),
    role: text("role"),
    legalOrganizationName: text("legal_organization_name").notNull(),
    organizationType: text("organization_type").notNull(),
    organizationAddress: text("organization_address").notNull(),
    projectTitle: text("project_title").notNull(),
    fundingProgram: text("funding_program").notNull(),
    desiredTiming: text("desired_timing").notNull(),
    selectedOffer: text("selected_offer").notNull(),
    projectDescription: text("project_description").notNull(),
    desiredOutcome: text("desired_outcome"),
    intendedUsers: text("intended_users"),
    approximateScale: text("approximate_scale"),
    currentSystems: text("current_systems"),
    accessibilityConnectivityNeeds: text("accessibility_connectivity_needs"),
    integrationNeeded: text("integration_needed"),
    sensitiveDataInvolved: text("sensitive_data_involved"),
    specialRequirements: text("special_requirements"),
    mode: text("mode").notNull(),
    subtotalCents: integer("subtotal_cents"),
    taxCents: integer("tax_cents"),
    totalCents: integer("total_cents"),
    validUntil: timestamp("valid_until", { withTimezone: true }),
    customerDeliveryStatus: text("customer_delivery_status"),
    customerDeliveryError: text("customer_delivery_error"),
    operatorDeliveryStatus: text("operator_delivery_status"),
    operatorDeliveryError: text("operator_delivery_error"),
    sourceIp: text("source_ip"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    quoteNumberIdx: uniqueIndex("quote_requests_quote_number_idx").on(
      table.quoteNumber,
    ),
  }),
);

export type QuoteRequestRow = typeof quoteRequestsTable.$inferSelect;
export type InsertQuoteRequestRow = typeof quoteRequestsTable.$inferInsert;