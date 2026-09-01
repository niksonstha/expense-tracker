import { api } from "../../services/api";

export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";

export type TransactionDirection = "IN" | "OUT";

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string | null;
  transferId: string | null;
  type: TransactionType;
  direction: TransactionDirection;
  amount: string;
  description: string | null;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  accountId: string;
  categoryId?: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  description?: string;
  transactionDate: string;
}

export interface UpdateTransactionRequest {
  accountId?: string;
  categoryId?: string | null;
  type?: "INCOME" | "EXPENSE";
  amount?: number;
  description?: string | null;
  transactionDate?: string;
}

export interface TransactionResponse {
  transaction: Transaction;
}

export interface TransactionFilters {
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
}

export interface TransactionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: TransactionPagination;
}

export async function createTransaction(
  data: CreateTransactionRequest,
): Promise<TransactionResponse> {
  const response = await api.post<TransactionResponse>("/transactions/", data);

  return response.data;
}

export async function getTransactions(
  filters: TransactionFilters = {},
): Promise<TransactionsResponse> {
  const response = await api.get<TransactionsResponse>("/transactions/", {
    params: filters,
  });

  return response.data;
}

export async function getTransaction(id: string): Promise<TransactionResponse> {
  const response = await api.get<TransactionResponse>(`/transactions/${id}`);

  return response.data;
}

export async function updateTransaction(
  id: string,
  data: UpdateTransactionRequest,
): Promise<TransactionResponse> {
  const response = await api.patch<TransactionResponse>(
    `/transactions/${id}`,
    data,
  );

  return response.data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await api.delete(`/transactions/${id}`);
}
