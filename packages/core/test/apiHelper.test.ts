import { sanitizeUrl } from '../src/apiHelper';

describe('sanitizeUrl', () => {
  it('should throw error on protocol not matching http or https', () => {
    expect.hasAssertions();
    try {
      sanitizeUrl('httpx://www.example.com');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe(
        'Invalid URL format: httpx://www.example.com'
      );
    }
  });

  it('should throw error on missing protocol', () => {
    expect.hasAssertions();
    try {
      sanitizeUrl('www.example.com');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe(
        'Invalid URL format: www.example.com'
      );
    }
  });

  it('should replace each occurence of multiple consecutive forward slashes with a single slash', () => {
    const url = sanitizeUrl('http://www.example.com/path//to///resource');
    expect(url).toBe('http://www.example.com/path/to/resource');
  });

  it('should do nothing on a correctly formatted url', () => {
    const input = 'http://www.example.com/path/to/resource';
    const url = sanitizeUrl(input);
    expect(url).toBe(input);
  });
});
