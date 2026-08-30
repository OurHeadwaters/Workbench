import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/react";

const API_BASE = "/api/engagements";

async function fetchWithAuth(url: string, getToken: () => Promise<string | null>, options: RequestInit = {}) {
  const token = await getToken();
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (options.method && options.method !== "GET") {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    let message = "An error occurred";
    try {
      const errData = await res.json();
      message = errData.error || message;
    } catch (e) {
      // Ignore JSON parse error
    }
    throw new Error(message);
  }
  return res.json();
}

export type EngagementState = "draft" | "active" | "handoff_pending" | "accepted" | "closed" | "cancelled";

export interface Engagement {
  id: string;
  organizationId: string;
  quoteRequestId: string | null;
  title: string;
  state: EngagementState;
  quoteAmountCents: number | null;
  currency: string;
  costCentreCode: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EngagementWithOrg extends Engagement {
  organization: {
    id: string;
    legalName: string;
    tenantOpaqueId: string;
  };
}

export interface EngagementIntegrationConfig {
  status: "pending" | "enabled" | "suspended";
  allowedEventTypes: string[];
  allowedPayloadFields: Record<string, string[]>;
  approvedAt: string | null;
}

export interface EngagementPostingRequest {
  id: string;
  invoiceId: string | null;
  paymentId: string | null;
  status: "pending" | "posted" | "manual_review";
  reason: string | null;
  accountingTransactionId: string | null;
  createdAt: string;
}

export interface EngagementPayment {
  id: string;
  invoiceId: string;
  amountCents: number;
  reference: string;
  receivedAt: string;
  reconciledAt: string | null;
  accountingTransactionId: string | null;
  createdAt: string;
}

export interface EngagementDetail extends EngagementWithOrg {
  scopes: any[];
  milestones: any[];
  changeOrders: any[];
  handoffs: any[];
  invoices: any[];
  payments: EngagementPayment[];
  postingRequests: EngagementPostingRequest[];
  integration: EngagementIntegrationConfig;
  timeline: any[];
}

export function useEngagements(tenantId: string) {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ["engagements", tenantId],
    queryFn: () => fetchWithAuth(`${API_BASE}?tenantId=${encodeURIComponent(tenantId)}`, getToken),
    enabled: !!tenantId,
  });
}

export function useEngagement(id: string, tenantId: string) {
  const { getToken } = useAuth();
  return useQuery<EngagementDetail>({
    queryKey: ["engagement", id, tenantId],
    queryFn: () => fetchWithAuth(`${API_BASE}/${id}?tenantId=${encodeURIComponent(tenantId)}`, getToken),
    enabled: !!id && !!tenantId,
  });
}

export function useConvertQuote() {
  const { getToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { tenantId: string; quoteRequestId: string }) =>
      fetchWithAuth(`${API_BASE}/convert-quote`, getToken, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["engagements", variables.tenantId] });
    },
  });
}

export function useChangeEngagementState() {
  const { getToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; tenantId: string; state: EngagementState }) =>
      fetchWithAuth(`${API_BASE}/${data.id}/state`, getToken, {
        method: "POST",
        body: JSON.stringify({ tenantId: data.tenantId, state: data.state }),
      }),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["engagement", variables.id, variables.tenantId] });
      qc.invalidateQueries({ queryKey: ["engagements", variables.tenantId] });
    },
  });
}

export function useCreateMilestone() {
  const { getToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; tenantId: string; title: string; amountCents?: number; dueAt?: string }) =>
      fetchWithAuth(`${API_BASE}/${data.id}/milestones`, getToken, {
        method: "POST",
        body: JSON.stringify({ tenantId: data.tenantId, title: data.title, amountCents: data.amountCents, dueAt: data.dueAt }),
      }),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["engagement", variables.id, variables.tenantId] });
    },
  });
}

export function useCreateChangeOrder() {
  const { getToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; tenantId: string; description: string; amountCents: number }) =>
      fetchWithAuth(`${API_BASE}/${data.id}/change-orders`, getToken, {
        method: "POST",
        body: JSON.stringify({ tenantId: data.tenantId, description: data.description, amountCents: data.amountCents }),
      }),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["engagement", variables.id, variables.tenantId] });
    },
  });
}

export function useCreateHandoff() {
  const { getToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; tenantId: string; acceptanceCriteria: any }) =>
      fetchWithAuth(`${API_BASE}/${data.id}/handoffs`, getToken, {
        method: "POST",
        body: JSON.stringify({ tenantId: data.tenantId, acceptanceCriteria: data.acceptanceCriteria }),
      }),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["engagement", variables.id, variables.tenantId] });
    },
  });
}

export function useCreateInvoice() {
  const { getToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; tenantId: string; amountCents: number; milestoneId?: string }) =>
      fetchWithAuth(`${API_BASE}/${data.id}/invoices`, getToken, {
        method: "POST",
        body: JSON.stringify({ tenantId: data.tenantId, amountCents: data.amountCents, milestoneId: data.milestoneId }),
      }),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["engagement", variables.id, variables.tenantId] });
    },
  });
}

export function useApproveInvoice() {
  const { getToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { engagementId: string; invoiceId: string; tenantId: string; revenueAccountCode: string; receivableAccountCode: string }) =>
      fetchWithAuth(`${API_BASE}/invoices/${data.invoiceId}/approve`, getToken, {
        method: "POST",
        body: JSON.stringify({ tenantId: data.tenantId, revenueAccountCode: data.revenueAccountCode, receivableAccountCode: data.receivableAccountCode }),
      }),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["engagement", variables.engagementId, variables.tenantId] });
    },
  });
}

export function useRecordPayment() {
  const { getToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { engagementId: string; invoiceId: string; tenantId: string; amountCents: number; reference: string; receivedAt: string; receivingAccountCode: string }) =>
      fetchWithAuth(`${API_BASE}/invoices/${data.invoiceId}/payments`, getToken, {
        method: "POST",
        body: JSON.stringify({
          tenantId: data.tenantId,
          amountCents: data.amountCents,
          reference: data.reference,
          receivedAt: data.receivedAt,
          receivingAccountCode: data.receivingAccountCode,
        }),
      }),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["engagement", variables.engagementId, variables.tenantId] });
    },
  });
}

export function usePostPostingRequest() {
  const { getToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { engagementId: string; postingRequestId: string; tenantId: string; postedDate?: string; reference?: string }) =>
      fetchWithAuth(`${API_BASE}/posting-requests/${data.postingRequestId}/post`, getToken, {
        method: "POST",
        body: JSON.stringify({ tenantId: data.tenantId, postedDate: data.postedDate, reference: data.reference }),
      }),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["engagement", variables.engagementId, variables.tenantId] });
    },
  });
}

export function useReconcilePayment() {
  const { getToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { engagementId: string; paymentId: string; tenantId: string }) =>
      fetchWithAuth(`${API_BASE}/payments/${data.paymentId}/reconcile`, getToken, {
        method: "POST",
        body: JSON.stringify({ tenantId: data.tenantId }),
      }),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["engagement", variables.engagementId, variables.tenantId] });
    },
  });
}

export function useOutbox(tenantId: string) {
  const { getToken } = useAuth();
  return useQuery<any[]>({
    queryKey: ["engagements-outbox", tenantId],
    queryFn: () => fetchWithAuth(`${API_BASE}/outbox/list?tenantId=${encodeURIComponent(tenantId)}`, getToken),
    enabled: !!tenantId,
  });
}

export function useRetryOutbox() {
  const { getToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string; tenantId: string }) =>
      fetchWithAuth(`${API_BASE}/outbox/${data.id}/retry`, getToken, {
        method: "POST",
        body: JSON.stringify({ tenantId: data.tenantId }),
      }),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["engagements-outbox", variables.tenantId] });
    },
  });
}
