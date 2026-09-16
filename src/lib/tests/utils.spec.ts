import { getInitials } from '../utils';

describe('getInitials', () => {
  it('uses first letters of the first two names', () => {
    expect(getInitials('Gustavo Aguiar')).toBe('GA');
    expect(getInitials('Maria A.')).toBe('MA');
  });

  it('uses the first two letters of a single name', () => {
    expect(getInitials('Maria')).toBe('MA');
    expect(getInitials('A')).toBe('A');
  });

  it('returns empty for blank names', () => {
    expect(getInitials('')).toBe('');
    expect(getInitials('   ')).toBe('');
  });
});
