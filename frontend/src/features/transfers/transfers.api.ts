import { api } from "../../services/api";

export interface Transfer {
  id: string;
  userId: string;
  fromAccountId: string;
  toAccountId: string;
  amount: string;
  description: string | null;
  transferDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransferRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
  transferDate: string;
}

export interface TransferResponse {
  transfer: Transfer;
}

export async function createTransfer(
  data: CreateTransferRequest,
): Promise<TransferResponse> {
  const response = await api.post<TransferResponse>("/transfers", data);

  return response.data;
}
