import { unknown, validateAndMap, validateAndUnmap } from '../../src';

describe('Unknown', () => {
  describe('Mapping', () => {
    it('should map', () => {
      const input = 'hello world';
      const schema = unknown();
      const output = validateAndMap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(input);
    });
  });
  describe('Unmapping', () => {
    it('should map', () => {
      const input = 'hello world';
      const schema = unknown();
      const output = validateAndUnmap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(input);
    });
  });
});
