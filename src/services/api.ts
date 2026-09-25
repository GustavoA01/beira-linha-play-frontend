import axios, { isAxiosError, type InternalAxiosRequestConfig } from 'axios';
import { endpoints } from './endpoints';

const FALLBACK_ERROR = 'Não foi possível completar a operação';

const AUTH_WITHOUT_RETRY = [
  endpoints.auth.login,
  endpoints.auth.register,
  endpoints.auth.refresh,
];

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const api = axios.create({
  baseURL: process.env.VITE_API_URL || undefined,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const toApiError = (error: {
  response?: { data?: unknown; status?: number };
}) => {
  const mensagem =
    (error.response?.data as { mensagem?: string } | undefined)?.mensagem ??
    FALLBACK_ERROR;
  return new ApiError(mensagem, error.response?.status);
};

const shouldSkipRetry = (url?: string) =>
  !url || AUTH_WITHOUT_RETRY.some((path) => url.includes(path));

let refreshInFlight: Promise<void> | null = null;

const refreshSession = () => {
  if (!refreshInFlight) {
    refreshInFlight = api
      .post(endpoints.auth.refresh)
      .then(() => undefined)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
};

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError(error)) return Promise.reject(error);

    const config = error.config as RetryConfig | undefined;
    const status = error.response?.status;

    if (
      status === 401 &&
      config &&
      !config._retry &&
      !shouldSkipRetry(config.url)
    ) {
      config._retry = true;
      try {
        await refreshSession();
        return api(config);
      } catch {
        return Promise.reject(toApiError(error));
      }
    }

    return Promise.reject(toApiError(error));
  }
);
