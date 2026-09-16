import {
  AxiosError,
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { api, ApiError } from './api';
import { endpoints } from './endpoints';

const withHeaders = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => ({
  ...config,
  headers: config.headers ?? new AxiosHeaders(),
});

const ok = <T>(
  config: InternalAxiosRequestConfig,
  data: T,
  status = 200
): AxiosResponse<T> => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: withHeaders(config),
});

const unauthorized = (config: InternalAxiosRequestConfig) => {
  const fullConfig = withHeaders(config);
  return new AxiosError(
    'Não autenticado',
    'ERR_BAD_REQUEST',
    fullConfig,
    null,
    {
      data: { mensagem: 'Não autenticado', status: 401 },
      status: 401,
      statusText: 'Unauthorized',
      headers: {},
      config: fullConfig,
    }
  );
};

describe('api refresh interceptor', () => {
  const originalAdapter = api.defaults.adapter;

  afterEach(() => {
    api.defaults.adapter = originalAdapter;
  });

  it('retries the original GET after a successful refresh', async () => {
    const calls: string[] = [];

    api.defaults.adapter = async (config) => {
      const key = `${config.method}:${config.url}`;
      calls.push(key);

      if (config.url?.includes(endpoints.auth.refresh)) {
        return ok(config, { id: '1', tipo: 'ALUNO' });
      }

      if (
        config.url === endpoints.courses.list &&
        !(config as { _retry?: boolean })._retry
      ) {
        throw unauthorized(config);
      }

      return ok(config, [{ id: 'curso-1' }]);
    };

    const { data } = await api.get(endpoints.courses.list);

    expect(data).toEqual([{ id: 'curso-1' }]);
    expect(calls).toEqual([
      `get:${endpoints.courses.list}`,
      `post:${endpoints.auth.refresh}`,
      `get:${endpoints.courses.list}`,
    ]);
  });

  it('does not refresh on login 401', async () => {
    const calls: string[] = [];

    api.defaults.adapter = async (config) => {
      calls.push(`${config.method}:${config.url}`);
      throw unauthorized(config);
    };

    await expect(
      api.post(endpoints.auth.login, { tipo: 'ALUNO', senha: 'x' })
    ).rejects.toBeInstanceOf(ApiError);

    expect(calls).toEqual([`post:${endpoints.auth.login}`]);
  });

  it('shares one refresh when two requests fail together', async () => {
    let refreshCount = 0;

    api.defaults.adapter = async (config) => {
      if (config.url?.includes(endpoints.auth.refresh)) {
        refreshCount += 1;
        return ok(config, { id: '1', tipo: 'ALUNO' });
      }

      if (
        config.url === endpoints.courses.list &&
        !(config as { _retry?: boolean })._retry
      ) {
        throw unauthorized(config);
      }

      return ok(config, [{ id: 'curso-1' }]);
    };

    const [first, second] = await Promise.all([
      api.get(endpoints.courses.list),
      api.get(endpoints.courses.list),
    ]);

    expect(first.data).toEqual([{ id: 'curso-1' }]);
    expect(second.data).toEqual([{ id: 'curso-1' }]);
    expect(refreshCount).toBe(1);
  });
});
