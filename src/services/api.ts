import axios, { isAxiosError } from 'axios';

const FALLBACK_ERROR = 'Não foi possível completar a operação';

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const api = axios.create({
  baseURL: process.env.VITE_API_URL ?? 'http://localhost:8080',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!isAxiosError(error)) {
      return Promise.reject(error);
    }

    const mensagem =
      (error.response?.data as { mensagem?: string } | undefined)?.mensagem ??
      FALLBACK_ERROR;

    return Promise.reject(new ApiError(mensagem, error.response?.status));
  }
);
