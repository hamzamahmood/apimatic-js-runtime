import {
  boolean,
  discriminatedObject,
  extendStrictObject,
  literal,
  number,
  strictObject,
  string,
  validateAndMap,
  validateAndUnmap,
} from '../../src';

describe('Discriminated Object', () => {
  const baseType = strictObject({
    type: ['type mapped', string()],
    baseField: ['base field', number()],
  });

  const childType1 = extendStrictObject(baseType, {
    type: ['type mapped', literal('child1')],
    child1Field: ['child1 field', boolean()],
  });

  const childType2 = extendStrictObject(baseType, {
    type: ['type mapped', literal('child2')],
    child2Field: ['child2 field', boolean()],
  });

  const schema = discriminatedObject(
    'type',
    'type mapped',
    {
      base: baseType,
      child1: childType1,
      child2: childType2,
    },
    'base'
  );

  describe('Mapping', () => {
    it('should map to child type on discriminator match', () => {
      const input = {
        'type mapped': 'child1',
        'base field': 123123,
        'child1 field': true,
      };
      const output = validateAndMap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual({
        type: 'child1',
        baseField: 123123,
        child1Field: true,
      });
    });

    it('should fail on schema invalidation', () => {
      const input = {
        'type mapped': 'child1',
        'base field': 123123,
        'child1 field': 101,
      };
      const output = validateAndMap(input, schema);
      expect(output.errors).toBeTruthy();
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Object {
                "base field": 123123,
                "child1 field": 101,
                "type mapped": "child1",
              },
              101,
            ],
            "message": "Expected value to be of type 'boolean' but found 'number'.

        Given value: 101
        Type: 'number'
        Expected type: 'boolean'
        Path: \\"child1 field\\"",
            "path": Array [
              "child1 field",
            ],
            "type": "boolean",
            "value": 101,
          },
        ]
      `);
    });

    it('should map to base type on discriminator match', () => {
      const input = {
        'type mapped': 'base',
        'base field': 123123,
      };
      const output = validateAndMap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual({
        type: 'base',
        baseField: 123123,
      });
    });

    it('should map to base type on no discriminator match', () => {
      const input = {
        'type mapped': 'hello world',
        'base field': 123123,
      };
      const output = validateAndMap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual({
        type: 'hello world',
        baseField: 123123,
      });
    });
  });
  describe('Unmapping', () => {
    it('should map to child type on discriminator match', () => {
      const input = {
        type: 'child1',
        baseField: 123123,
        child1Field: true,
      };
      const output = validateAndUnmap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual({
        'type mapped': 'child1',
        'base field': 123123,
        'child1 field': true,
      });
    });

    it('should fail on schema invalidation', () => {
      const input = {
        type: 'child1',
        baseField: 123123,
        child1Field: 101,
      };
      const output = validateAndUnmap(input, schema);
      expect(output.errors).toBeTruthy();
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Object {
                "baseField": 123123,
                "child1Field": 101,
                "type": "child1",
              },
              101,
            ],
            "message": "Expected value to be of type 'boolean' but found 'number'.

        Given value: 101
        Type: 'number'
        Expected type: 'boolean'
        Path: child1Field",
            "path": Array [
              "child1Field",
            ],
            "type": "boolean",
            "value": 101,
          },
        ]
      `);
    });

    it('should map to base type on discriminator match', () => {
      const input = {
        type: 'base',
        baseField: 123123,
      };
      const output = validateAndUnmap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual({
        'type mapped': 'base',
        'base field': 123123,
      });
    });

    it('should map to base type on no discriminator match', () => {
      const input = {
        type: 'hello world',
        baseField: 123123,
      };
      const output = validateAndUnmap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual({
        'type mapped': 'hello world',
        'base field': 123123,
      });
    });
  });
});
