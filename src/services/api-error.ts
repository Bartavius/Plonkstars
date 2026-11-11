import { isAxiosError, type AxiosResponse } from "axios";

export interface ApiErrorBody {
  error?: string;
  message?: string;
}

export function getErrorResponse(err: unknown): AxiosResponse<ApiErrorBody> | undefined {
  return isAxiosError<ApiErrorBody>(err) ? err.response : undefined;
}
