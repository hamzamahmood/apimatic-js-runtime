import { string, validateAndMap, validateAndUnmap } from '../../src';

describe('String', () => {
  describe('Mapping', () => {
    it('should accept string', () => {
      const input = 'hello world';
      const schema = string();
      const output = validateAndMap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(input);
    });

    it('should not accept invalid types', () => {
      const input = 123123;
      const schema = string();
      const output = validateAndMap(input as any, schema);
      expect(output.errors).toBeTruthy();
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              123123,
            ],
            "message": undefined,
            "path": Array [],
            "type": "string",
            "value": 123123,
          },
        ]
      `);
    });
  });

  describe('Unmapping', () => {
    it('should accept string', () => {
      const input = 'hello world';
      const schema = string();
      const output = validateAndUnmap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(input);
    });

    it('should not accept invalid types', () => {
      const input = 123123;
      const schema = string();
      const output = validateAndUnmap(input as any, schema);
      expect(output.errors).toBeTruthy();
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              123123,
            ],
            "message": undefined,
            "path": Array [],
            "type": "string",
            "value": 123123,
          },
        ]
      `);
    });
  });
});
