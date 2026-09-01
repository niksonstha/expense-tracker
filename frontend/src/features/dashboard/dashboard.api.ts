import { api } from "../../services/api";

export interface DashboardSummary {
  totalBalance: string;
  totalIncome: string;
  totalExpense: string;
}

export interface DashboardAccount {
  id: string;
  userId: string;
  name: string;
  type: "BANK" | "SAVINGS" | "CASH" | "CREDIT_CARD";
  initialBalance: string;
  balance: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardTransaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string | null;
  transferId: string | null;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  direction: "IN" | "OUT";
  amount: string;
  description: string | null;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSpending {
  categoryId: string;
  category: string;
  amount: string;
  percentage: string;
}

export interface DashboardPeriod {
  year: number;
  month: number;
}

export interface Dashboard {
  summary: DashboardSummary;
  accounts: DashboardAccount[];
  recentTransactions: DashboardTransaction[];
  spending: DashboardSpending[];
  spendingTotal: string;
  period: DashboardPeriod;
}

export interface DashboardResponse {
  dashboard: Dashboard;
}

export async function getDashboard(): Promise<DashboardResponse> {
  const response = await api.get<DashboardResponse>("/dashboard/");

  return response.data;
}
