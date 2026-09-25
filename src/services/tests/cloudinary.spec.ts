import { publicIdFromUrl } from '../cloudinary';

describe('publicIdFromUrl', () => {
  it('reads the public id after the version and drops the extension', () => {
    expect(
      publicIdFromUrl(
        'https://res.cloudinary.com/demo/image/upload/v171/pasta/foto.png'
      )
    ).toBe('pasta/foto');
  });

  it('ignores transformation segments', () => {
    expect(
      publicIdFromUrl(
        'https://res.cloudinary.com/demo/image/upload/c_fill,w_200/v12/avatar.jpg'
      )
    ).toBe('avatar');
  });

  it('returns null when the url has no upload path', () => {
    expect(publicIdFromUrl('https://example.com/foto.png')).toBeNull();
    expect(publicIdFromUrl('nao-e-url')).toBeNull();
  });
});
