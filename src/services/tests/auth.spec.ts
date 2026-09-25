import type { UserResponseType } from '@/data/types/services';
import { ApiError, api } from '../api';
import { currentUser, refresh, toUser } from '../auth';

jest.mock('../api', () => {
  const actual = jest.requireActual<typeof import('../api')>('../api');
  return {
    ApiError: actual.ApiError,
    api: {
      get: jest.fn(),
      post: jest.fn(),
    },
  };
});

const mockedGet = api.get as jest.Mock;
const mockedPost = api.post as jest.Mock;

const response = (
  overrides: Partial<UserResponseType> & Pick<UserResponseType, 'tipo'>
): UserResponseType => ({
  id: '1',
  nome: 'Ana',
  cursoIds: ['curso-1'],
  email: null,
  apelido: null,
  pontos: null,
  imagemPerfil: null,
  cursoOrigem: null,
  ...overrides,
});

describe('toUser', () => {
  it('fills student defaults when the API omits profile fields', () => {
    expect(toUser(response({ tipo: 'ALUNO' }))).toEqual({
      id: '1',
      nome: 'Ana',
      tipo: 'ALUNO',
      apelido: '',
      pontos: 0,
      imagemPerfil: '',
      cursoIds: ['curso-1'],
    });
  });

  it('keeps the monitor email and origin course', () => {
    expect(
      toUser(
        response({
          tipo: 'MONITOR',
          email: 'ana@escola.com',
          cursoOrigem: 'curso-1',
        })
      )
    ).toEqual({
      id: '1',
      nome: 'Ana',
      tipo: 'MONITOR',
      email: 'ana@escola.com',
      cursoIds: ['curso-1'],
      cursoOrigem: 'curso-1',
    });
  });

  it('keeps only name and id for an admin', () => {
    expect(
      toUser(response({ tipo: 'ADMIN', email: 'admin@escola.com' }))
    ).toEqual({
      id: '1',
      nome: 'Ana',
      tipo: 'ADMIN',
    });
  });
});

describe('currentUser', () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it('returns null on 401 and rethrows other errors', async () => {
    mockedGet.mockRejectedValueOnce(new ApiError('Não autenticado', 401));
    await expect(currentUser()).resolves.toBeNull();

    const failure = new ApiError('Indisponível', 500);
    mockedGet.mockRejectedValueOnce(failure);
    await expect(currentUser()).rejects.toBe(failure);
  });
});

describe('refresh', () => {
  beforeEach(() => {
    mockedPost.mockReset();
  });

  it('returns null when the refresh request fails', async () => {
    mockedPost.mockRejectedValue(new Error('network'));
    await expect(refresh()).resolves.toBeNull();
  });
});
