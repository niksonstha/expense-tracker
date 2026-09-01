import { api } from "../../services/api";

export type AccountType = "BANK" | "SAVINGS" | "CASH" | "CREDIT_CARD";

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  initialBalance: string;
  balance: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountRequest {
  name: string;
  type: AccountType;
  initialBalance: number;
}

export interface UpdateAccountRequest {
  name?: string;
  type?: AccountType;
  initialBalance?: number;
}

export interface AccountResponse {
  account: Account;
}

export interface AccountsResponse {
  accounts: Account[];
}

export interface AccountBalanceResponse {
  balance: string;
}

export async function getAccounts(): Promise<AccountsResponse> {
  const response = await api.get<AccountsResponse>("/account/");

  return response.data;
}

export async function getAccount(id: string): Promise<AccountResponse> {
  const response = await api.get<AccountResponse>(`/account/${id}`);

  return response.data;
}

export async function createAccount(
  data: CreateAccountRequest,
): Promise<AccountResponse> {
  const response = await api.post<AccountResponse>("/account/", data);

  return response.data;
}

export async function updateAccount(
  id: string,
  data: UpdateAccountRequest,
): Promise<AccountResponse> {
  const response = await api.patch<AccountResponse>(`/account/${id}`, data);

  return response.data;
}

export async function deleteAccount(id: string): Promise<void> {
  await api.delete(`/account/${id}`);
}

export async function getAccountBalance(
  id: string,
): Promise<AccountBalanceResponse> {
  const response = await api.get<AccountBalanceResponse>(
    `/account/${id}/balance`,
  );

  return response.data;
}
