import {
  array,
  boolean,
  defaults,
  dict,
  discriminatedObject,
  extendStrictObject,
  lazy,
  literal,
  nullable,
  number,
  numberEnum,
  object,
  optional,
  Schema,
  SchemaMappedType,
  SchemaType,
  strictObject,
  string,
  stringEnum,
  unknown,
  validateAndMap,
  validateAndMapXml,
  validateAndUnmap,
  validateAndUnmapXml,
} from '../src';
import { Boss, bossSchema } from './bossSchema';

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

describe('Number', () => {
  describe('Mapping', () => {
    it('should accept number', () => {
      const input = 123123;
      const schema = number();
      const output = validateAndMap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(input);
    });

    it('should accept numeric string', () => {
      const input = '123123';
      const schema = number();
      const output = validateAndMap(input as any, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(123123);
    });

    it('should fail on other types', () => {
      const input = true;
      const schema = number();
      const output = validateAndMap(input as any, schema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              true,
            ],
            "message": undefined,
            "path": Array [],
            "type": "number",
            "value": true,
          },
        ]
      `);
    });
  });
  describe('Unmapping', () => {
    it('should accept number', () => {
      const input = 123123;
      const schema = number();
      const output = validateAndUnmap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(input);
    });

    it('should accept numeric string', () => {
      const input = '123123';
      const schema = number();
      const output = validateAndUnmap(input as any, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(123123);
    });

    it('should fail on other types', () => {
      const input = true;
      const schema = number();
      const output = validateAndUnmap(input as any, schema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              true,
            ],
            "message": undefined,
            "path": Array [],
            "type": "number",
            "value": true,
          },
        ]
      `);
    });
  });
});

describe('Boolean', () => {
  describe('Mapping', () => {
    it('should accept boolean true', () => {
      const input = true;
      const schema = boolean();
      const output = validateAndMap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(input);
    });

    it('should accept boolean false', () => {
      const input = false;
      const schema = boolean();
      const output = validateAndMap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(input);
    });

    it('should accept string "true"', () => {
      const input = 'true';
      const schema = boolean();
      const output = validateAndMap(input as any, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(true);
    });

    it('should accept string "false"', () => {
      const input = 'false';
      const schema = boolean();
      const output = validateAndMap(input as any, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(false);
    });

    it('should fail on other types', () => {
      const input = 123123;
      const schema = boolean();
      const output = validateAndMap(input as any, schema);
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
            "type": "boolean",
            "value": 123123,
          },
        ]
      `);
    });
  });
  describe('Unmapping', () => {
    it('should accept boolean true', () => {
      const input = true;
      const schema = boolean();
      const output = validateAndUnmap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(input);
    });

    it('should accept boolean false', () => {
      const input = false;
      const schema = boolean();
      const output = validateAndUnmap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(input);
    });

    it('should fail on other types', () => {
      const input = 'hello world';
      const schema = boolean();
      const output = validateAndUnmap(input as any, schema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              "hello world",
            ],
            "message": undefined,
            "path": Array [],
            "type": "boolean",
            "value": "hello world",
          },
        ]
      `);
    });
  });
});

describe('Literal', () => {
  describe('Mapping', () => {
    it('should accept primitive-type literal', () => {
      const input = 123;
      const schema = literal(123);
      const output = validateAndMap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(input);
    });

    it('should accept object literal', () => {
      const input = {};
      const schema = literal(input);
      const output = validateAndMap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(input);
    });

    it('should failing on invalid values', () => {
      const input = 'hello world';
      const schema = literal(123);
      const output = validateAndMap(input as any, schema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              "hello world",
            ],
            "message": undefined,
            "path": Array [],
            "type": "Literal<123>",
            "value": "hello world",
          },
        ]
      `);
    });
  });
  describe('Unmapping', () => {
    it('should accept primitive-type literal', () => {
      const input = 123;
      const schema = literal(123);
      const output = validateAndUnmap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(input);
    });

    it('should accept object literal', () => {
      const input = {};
      const schema = literal(input);
      const output = validateAndUnmap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(input);
    });

    it('should failing on invalid values', () => {
      const input = 'hello world';
      const schema = literal(123);
      const output = validateAndUnmap(input as any, schema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              "hello world",
            ],
            "message": undefined,
            "path": Array [],
            "type": "Literal<123>",
            "value": "hello world",
          },
        ]
      `);
    });
  });
});

describe('Optional', () => {
  describe('Mapping', () => {
    it('should accept valid defined value', () => {
      const input = 'hello world';
      const schema = optional(string());
      const output = validateAndMap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(input);
    });

    it('should accept undefined', () => {
      const schema = optional(string());
      const output = validateAndMap(undefined, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBeUndefined();
    });

    it('should fail on schema invalidation', () => {
      const input = 123;
      const schema = optional(string());
      const output = validateAndMap(input as any, schema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              123,
            ],
            "message": undefined,
            "path": Array [],
            "type": "Optional<string>",
            "value": 123,
          },
        ]
      `);
    });
  });
  describe('Unmapping', () => {
    it('should accept valid defined value', () => {
      const input = 'hello world';
      const schema = optional(string());
      const output = validateAndUnmap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(input);
    });

    it('should accept undefined', () => {
      const schema = optional(string());
      const output = validateAndUnmap(undefined, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBeUndefined();
    });

    it('should fail on schema invalidation', () => {
      const input = 123;
      const schema = optional(string());
      const output = validateAndUnmap(input as any, schema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              123,
            ],
            "message": undefined,
            "path": Array [],
            "type": "Optional<string>",
            "value": 123,
          },
        ]
      `);
    });
  });
});

describe('Nullable', () => {
  describe('Mapping', () => {
    it('should accept valid defined value', () => {
      const input = 'hello world';
      const schema = nullable(string());
      const output = validateAndMap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(input);
    });

    it('should accept null', () => {
      const schema = nullable(string());
      const output = validateAndMap(null, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBeNull();
    });

    it('should fail on schema invalidation', () => {
      const input = 123;
      const schema = nullable(string());
      const output = validateAndMap(input as any, schema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              123,
            ],
            "message": undefined,
            "path": Array [],
            "type": "Nullable<string>",
            "value": 123,
          },
        ]
      `);
    });
  });
  describe('Unmapping', () => {
    it('should accept valid defined value', () => {
      const input = 'hello world';
      const schema = nullable(string());
      const output = validateAndUnmap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(input);
    });

    it('should accept null', () => {
      const schema = nullable(string());
      const output = validateAndUnmap(null, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBeNull();
    });

    it('should fail on schema invalidation', () => {
      const input = 123;
      const schema = nullable(string());
      const output = validateAndUnmap(input as any, schema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              123,
            ],
            "message": undefined,
            "path": Array [],
            "type": "Nullable<string>",
            "value": 123,
          },
        ]
      `);
    });
  });
});

describe('Array', () => {
  describe('Mapping', () => {
    it('should accept valid array', () => {
      const input = ['hello', 'world'];
      const schema = array(string());
      const output = validateAndMap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(input);
    });

    it('should fail on item schema invalidation', () => {
      const input = ['hello', 123];
      const schema = array(string());
      const output = validateAndMap(input as any, schema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Array [
                "hello",
                123,
              ],
              123,
            ],
            "message": undefined,
            "path": Array [
              1,
            ],
            "type": "string",
            "value": 123,
          },
        ]
      `);
    });

    it('should not accept non-array value', () => {
      const input = 123;
      const schema = array(string());
      const output = validateAndMap(input as any, schema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              123,
            ],
            "message": undefined,
            "path": Array [],
            "type": "Array<string>",
            "value": 123,
          },
        ]
      `);
    });
  });
  describe('Unmapping', () => {
    it('should accept valid array', () => {
      const input = ['hello', 'world'];
      const schema = array(string());
      const output = validateAndUnmap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(input);
    });

    it('should fail on item schema invalidation', () => {
      const input = ['hello', 123];
      const schema = array(string());
      const output = validateAndUnmap(input as any, schema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Array [
                "hello",
                123,
              ],
              123,
            ],
            "message": undefined,
            "path": Array [
              1,
            ],
            "type": "string",
            "value": 123,
          },
        ]
      `);
    });

    it('should not accept non-array value', () => {
      const input = 123;
      const schema = array(string());
      const output = validateAndUnmap(input as any, schema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              123,
            ],
            "message": undefined,
            "path": Array [],
            "type": "Array<string>",
            "value": 123,
          },
        ]
      `);
    });
  });
});

describe('Strict Object', () => {
  const userSchema = strictObject({
    id: ['user_id', string()],
    age: ['user_age', number()],
  });

  describe('Mapping', () => {
    it('should map valid object', () => {
      const input = {
        user_id: 'John Smith',
        user_age: 50,
      };
      const output = validateAndMap(input, userSchema);
      const expected: SchemaType<typeof userSchema> = {
        id: 'John Smith',
        age: 50,
      };
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(expected);
    });

    it('should map object with spaces in property names', () => {
      const input = {
        id: 'John Smith',
      };
      const schema = strictObject({ 'user id': ['id', string()] });
      const output = validateAndMap(input, schema);
      const expected: SchemaType<typeof schema> = {
        'user id': 'John Smith',
      };
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(expected);
    });

    it('should map object with optional properties', () => {
      const addressSchema = strictObject({
        address1: ['address1', string()],
        address2: ['address2', optional(string())],
      });
      const input = {
        address1: 'first',
      };
      const output = validateAndMap(input, addressSchema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(input);
    });

    it('should fail on non-object value', () => {
      const input = 'not an object';
      const output = validateAndMap(input as any, userSchema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              "not an object",
            ],
            "message": undefined,
            "path": Array [],
            "type": "StrictObject<{id,age}>",
            "value": "not an object",
          },
        ]
      `);
    });

    it('should fail on schema property invalidation', () => {
      const input = {
        user_id: 'John Smith',
        user_age: true,
      };
      const output = validateAndMap(input as any, userSchema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Object {
                "user_age": true,
                "user_id": "John Smith",
              },
              true,
            ],
            "message": undefined,
            "path": Array [
              "user_age",
            ],
            "type": "number",
            "value": true,
          },
        ]
      `);
    });

    it('should fail on missing properties', () => {
      const input = {
        user_id: 'John Smith',
      };
      const output = validateAndMap(input as any, userSchema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Object {
                "user_id": "John Smith",
              },
            ],
            "message": "Some properties are missing in the object: \\"user_age\\".",
            "path": Array [],
            "type": "StrictObject<{id,age}>",
            "value": Object {
              "user_id": "John Smith",
            },
          },
        ]
      `);
    });

    it('should fail on extra properties', () => {
      const input = {
        user_id: 'John Smith',
        user_age: 50,
        extra: true,
      };
      const output = validateAndMap(input, userSchema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Object {
                "extra": true,
                "user_age": 50,
                "user_id": "John Smith",
              },
            ],
            "message": "Some unknown properties were found in the object: \\"extra\\".",
            "path": Array [],
            "type": "StrictObject<{id,age}>",
            "value": Object {
              "extra": true,
              "user_age": 50,
              "user_id": "John Smith",
            },
          },
        ]
      `);
    });
  });

  describe('Unmapping', () => {
    it('should map valid object', () => {
      const input = {
        id: 'John Smith',
        age: 50,
      };
      const output = validateAndUnmap(input, userSchema);
      const expected: SchemaMappedType<typeof userSchema> = {
        user_id: 'John Smith',
        user_age: 50,
      };
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(expected);
    });

    it('should map object with optional properties', () => {
      const addressSchema = strictObject({
        address1: ['address1', string()],
        address2: ['address2', optional(string())],
      });
      const input = {
        address1: 'first',
      };
      const output = validateAndUnmap(input, addressSchema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(input);
    });

    it('should fail on non-object value', () => {
      const input = 'not an object';
      const output = validateAndUnmap(input as any, userSchema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              "not an object",
            ],
            "message": undefined,
            "path": Array [],
            "type": "StrictObject<{id,age}>",
            "value": "not an object",
          },
        ]
      `);
    });

    it('should fail on schema property invalidation', () => {
      const input = {
        id: 'John Smith',
        age: true,
      };
      const output = validateAndUnmap(input as any, userSchema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Object {
                "age": true,
                "id": "John Smith",
              },
              true,
            ],
            "message": undefined,
            "path": Array [
              "age",
            ],
            "type": "number",
            "value": true,
          },
        ]
      `);
    });

    it('should fail on missing properties', () => {
      const input = {
        id: 'John Smith',
      };
      const output = validateAndUnmap(input as any, userSchema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Object {
                "id": "John Smith",
              },
            ],
            "message": "Some properties are missing in the object: \\"age\\".",
            "path": Array [],
            "type": "StrictObject<{id,age}>",
            "value": Object {
              "id": "John Smith",
            },
          },
        ]
      `);
    });

    it('should fail on extra properties', () => {
      const input = {
        id: 'John Smith',
        age: 50,
        extra: true,
      };
      const output = validateAndUnmap(input, userSchema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Object {
                "age": 50,
                "extra": true,
                "id": "John Smith",
              },
            ],
            "message": "Some unknown properties were found in the object: \\"extra\\".",
            "path": Array [],
            "type": "StrictObject<{id,age}>",
            "value": Object {
              "age": 50,
              "extra": true,
              "id": "John Smith",
            },
          },
        ]
      `);
    });
  });
});

describe('Extend Strict Object', () => {
  const idObject = strictObject({
    id: ['user_id', string()],
  });

  const userSchema = extendStrictObject(idObject, {
    age: ['user_age', number()],
  });

  describe('Mapping', () => {
    it('should map valid object', () => {
      const input = {
        user_id: 'John Smith',
        user_age: 50,
      };
      const output = validateAndMap(input, userSchema);
      const expected: SchemaType<typeof userSchema> = {
        id: 'John Smith',
        age: 50,
      };
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(expected);
    });

    it('should map object with optional properties', () => {
      const addressSchema = extendStrictObject(
        strictObject({
          address1: ['address1', string()],
        }),
        {
          address2: ['address2', optional(string())],
        }
      );
      const input = {
        address1: 'first',
      };
      const output = validateAndMap(input, addressSchema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(input);
    });

    it('should fail on non-object value', () => {
      const input = 'not an object';
      const output = validateAndMap(input as any, userSchema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              "not an object",
            ],
            "message": undefined,
            "path": Array [],
            "type": "StrictObject<{id,age}>",
            "value": "not an object",
          },
        ]
      `);
    });

    it('should fail on schema property invalidation', () => {
      const input = {
        user_id: 'John Smith',
        user_age: true,
      };
      const output = validateAndMap(input as any, userSchema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Object {
                "user_age": true,
                "user_id": "John Smith",
              },
              true,
            ],
            "message": undefined,
            "path": Array [
              "user_age",
            ],
            "type": "number",
            "value": true,
          },
        ]
      `);
    });

    it('should fail on missing properties', () => {
      const input = {
        user_id: 'John Smith',
      };
      const output = validateAndMap(input as any, userSchema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Object {
                "user_id": "John Smith",
              },
            ],
            "message": "Some properties are missing in the object: \\"user_age\\".",
            "path": Array [],
            "type": "StrictObject<{id,age}>",
            "value": Object {
              "user_id": "John Smith",
            },
          },
        ]
      `);
    });

    it('should fail on extra properties', () => {
      const input = {
        user_id: 'John Smith',
        user_age: 50,
        extra: true,
      };
      const output = validateAndMap(input, userSchema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Object {
                "extra": true,
                "user_age": 50,
                "user_id": "John Smith",
              },
            ],
            "message": "Some unknown properties were found in the object: \\"extra\\".",
            "path": Array [],
            "type": "StrictObject<{id,age}>",
            "value": Object {
              "extra": true,
              "user_age": 50,
              "user_id": "John Smith",
            },
          },
        ]
      `);
    });
  });

  describe('Unmapping', () => {
    it('should map valid object', () => {
      const input = {
        id: 'John Smith',
        age: 50,
      };
      const output = validateAndUnmap(input, userSchema);
      const expected: SchemaMappedType<typeof userSchema> = {
        user_id: 'John Smith',
        user_age: 50,
      };
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(expected);
    });

    it('should map object with optional properties', () => {
      const addressSchema = extendStrictObject(
        strictObject({
          address1: ['address1', string()],
        }),
        {
          address2: ['address2', optional(string())],
        }
      );
      const input = {
        address1: 'first',
      };
      const output = validateAndUnmap(input, addressSchema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(input);
    });

    it('should fail on non-object value', () => {
      const input = 'not an object';
      const output = validateAndUnmap(input as any, userSchema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              "not an object",
            ],
            "message": undefined,
            "path": Array [],
            "type": "StrictObject<{id,age}>",
            "value": "not an object",
          },
        ]
      `);
    });

    it('should fail on schema property invalidation', () => {
      const input = {
        id: 'John Smith',
        age: true,
      };
      const output = validateAndUnmap(input as any, userSchema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Object {
                "age": true,
                "id": "John Smith",
              },
              true,
            ],
            "message": undefined,
            "path": Array [
              "age",
            ],
            "type": "number",
            "value": true,
          },
        ]
      `);
    });

    it('should fail on missing properties', () => {
      const input = {
        id: 'John Smith',
      };
      const output = validateAndUnmap(input as any, userSchema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Object {
                "id": "John Smith",
              },
            ],
            "message": "Some properties are missing in the object: \\"age\\".",
            "path": Array [],
            "type": "StrictObject<{id,age}>",
            "value": Object {
              "id": "John Smith",
            },
          },
        ]
      `);
    });

    it('should fail on extra properties', () => {
      const input = {
        id: 'John Smith',
        age: 50,
        extra: true,
      };
      const output = validateAndUnmap(input, userSchema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Object {
                "age": 50,
                "extra": true,
                "id": "John Smith",
              },
            ],
            "message": "Some unknown properties were found in the object: \\"extra\\".",
            "path": Array [],
            "type": "StrictObject<{id,age}>",
            "value": Object {
              "age": 50,
              "extra": true,
              "id": "John Smith",
            },
          },
        ]
      `);
    });
  });
});

describe('Object', () => {
  describe('Mapping', () => {
    const userSchema = object({
      id: ['user_id', string()],
      age: ['user_age', number()],
    });

    it('should map valid object', () => {
      const input = {
        user_id: 'John Smith',
        user_age: 50,
      };
      const output = validateAndMap(input, userSchema);
      const expected: SchemaType<typeof userSchema> = {
        id: 'John Smith',
        age: 50,
      };
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(expected);
    });

    it('should map object with optional properties', () => {
      const addressSchema = object({
        address1: ['address1', string()],
        address2: ['address2', optional(string())],
      });
      const input = {
        address1: 'first',
      };
      const output = validateAndMap(input, addressSchema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(input);
    });

    it('should map valid object with additional properties', () => {
      const input = {
        user_id: 'John Smith',
        user_age: 50,
        user_address: 'New York',
      };
      const output = validateAndMap(input, userSchema);
      const expected: SchemaType<typeof userSchema> = {
        id: 'John Smith',
        age: 50,
        user_address: 'New York',
      };
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(expected);
    });

    it('should fail on non-object value', () => {
      const input = 'not an object';
      const output = validateAndMap(input as any, userSchema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              "not an object",
            ],
            "message": undefined,
            "path": Array [],
            "type": "Object<{id,age,...}>",
            "value": "not an object",
          },
        ]
      `);
    });

    it('should fail on schema property invalidation', () => {
      const input = {
        user_id: 'John Smith',
        user_age: true,
      };
      const output = validateAndMap(input as any, userSchema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Object {
                "user_age": true,
                "user_id": "John Smith",
              },
              true,
            ],
            "message": undefined,
            "path": Array [
              "user_age",
            ],
            "type": "number",
            "value": true,
          },
        ]
      `);
    });

    it('should fail on missing properties', () => {
      const input = {
        user_id: 'John Smith',
      };
      const output = validateAndMap(input as any, userSchema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Object {
                "user_id": "John Smith",
              },
            ],
            "message": "Some properties are missing in the object: \\"user_age\\".",
            "path": Array [],
            "type": "Object<{id,age,...}>",
            "value": Object {
              "user_id": "John Smith",
            },
          },
        ]
      `);
    });
  });
  describe('Unmapping', () => {
    const userSchema = object({
      id: ['user_id', string()],
      age: ['user_age', number()],
    });

    it('should map valid object', () => {
      const input = {
        id: 'John Smith',
        age: 50,
      };
      const output = validateAndUnmap(input, userSchema);
      const expected: SchemaMappedType<typeof userSchema> = {
        user_id: 'John Smith',
        user_age: 50,
      };
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(expected);
    });

    it('should map object with optional properties', () => {
      const addressSchema = object({
        address1: ['address1', string()],
        address2: ['address2', optional(string())],
      });
      const input = {
        address1: 'first',
      };
      const output = validateAndUnmap(input, addressSchema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(input);
    });

    it('should map valid object with additional properties', () => {
      const input = {
        id: 'John Smith',
        age: 50,
        address: 'San Francisco',
      };
      const output = validateAndUnmap(input, userSchema);
      const expected: SchemaMappedType<typeof userSchema> = {
        user_id: 'John Smith',
        user_age: 50,
        address: 'San Francisco',
      };
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(expected);
    });

    it('should fail on non-object value', () => {
      const input = 'not an object';
      const output = validateAndUnmap(input as any, userSchema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              "not an object",
            ],
            "message": undefined,
            "path": Array [],
            "type": "Object<{id,age,...}>",
            "value": "not an object",
          },
        ]
      `);
    });

    it('should fail on schema property invalidation', () => {
      const input = {
        id: 'John Smith',
        age: true,
      };
      const output = validateAndUnmap(input as any, userSchema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Object {
                "age": true,
                "id": "John Smith",
              },
              true,
            ],
            "message": undefined,
            "path": Array [
              "age",
            ],
            "type": "number",
            "value": true,
          },
        ]
      `);
    });

    it('should fail on missing properties', () => {
      const input = {
        id: 'John Smith',
      };
      const output = validateAndUnmap(input as any, userSchema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Object {
                "id": "John Smith",
              },
            ],
            "message": "Some properties are missing in the object: \\"age\\".",
            "path": Array [],
            "type": "Object<{id,age,...}>",
            "value": Object {
              "id": "John Smith",
            },
          },
        ]
      `);
    });
  });
});

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

describe('Dictionary', () => {
  describe('Mapping', () => {
    it('should map valid dictionary', () => {
      const input = {
        key1: 'hello',
        key2: 'world',
      };
      const schema = dict(string());
      const output = validateAndMap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(input);
    });

    it('should fail on other types', () => {
      const input = 123123;
      const schema = dict(string());
      const output = validateAndUnmap(input as any, schema);
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
            "type": "Record<string,string>",
            "value": 123123,
          },
        ]
      `);
    });

    it('should fail on item schema invalidation', () => {
      const input = {
        key1: 'hello',
        key2: false,
      };
      const schema = dict(string());
      const output = validateAndUnmap(input as any, schema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Object {
                "key1": "hello",
                "key2": false,
              },
              false,
            ],
            "message": undefined,
            "path": Array [
              "key2",
            ],
            "type": "string",
            "value": false,
          },
        ]
      `);
    });
  });
  describe('Unmapping', () => {
    it('should map valid dictionary', () => {
      const input = {
        key1: 'hello',
        key2: 'world',
      };
      const schema = dict(string());
      const output = validateAndUnmap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(input);
    });

    it('should fail on other types', () => {
      const input = 123123;
      const schema = dict(string());
      const output = validateAndUnmap(input as any, schema);
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
            "type": "Record<string,string>",
            "value": 123123,
          },
        ]
      `);
    });

    it('should fail on item schema invalidation', () => {
      const input = {
        key1: 'hello',
        key2: false,
      };
      const schema = dict(string());
      const output = validateAndUnmap(input as any, schema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Object {
                "key1": "hello",
                "key2": false,
              },
              false,
            ],
            "message": undefined,
            "path": Array [
              "key2",
            ],
            "type": "string",
            "value": false,
          },
        ]
      `);
    });
  });
});

describe('Defaults', () => {
  describe('Mapping', () => {
    it('should map using nested schema', () => {
      const input = 'hello world';
      const schema = defaults(string(), 'default value');
      const output = validateAndMap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(input);
    });

    it('should map to default value on null', () => {
      const schema = defaults(nullable(string()), 'default value');
      const output = validateAndMap(null, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe('default value');
    });

    it('should map to default value on undefined', () => {
      const schema = defaults(optional(string()), 'default value');
      const output = validateAndMap(undefined, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe('default value');
    });

    it('should fail on schema invalidation', () => {
      const input = 123123;
      const schema = defaults(string(), 'default value');
      const output = validateAndMap(input as any, schema);
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
            "type": "Defaults<string,\\"default value\\">",
            "value": 123123,
          },
        ]
      `);
    });
  });

  describe('Unmapping', () => {
    it('should map using nested schema', () => {
      const input = 'hello world';
      const schema = defaults(string(), 'default value');
      const output = validateAndUnmap(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(input);
    });

    it('should map to default value on null', () => {
      const schema = defaults(nullable(string()), 'default value');
      const output = validateAndUnmap(null, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe('default value');
    });

    it('should map to default value on undefined', () => {
      const schema = defaults(optional(string()), 'default value');
      const output = validateAndUnmap(undefined, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe('default value');
    });

    it('should fail on schema invalidation', () => {
      const input = 123123;
      const schema = defaults(string(), 'default value');
      const output = validateAndUnmap(input as any, schema);
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
            "type": "Defaults<string,\\"default value\\">",
            "value": 123123,
          },
        ]
      `);
    });
  });
});

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
            "message": undefined,
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
            "message": undefined,
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

describe('String Enum', () => {
  enum SampleStringEnum {
    Hearts = '_hearts',
    Spades = '_spades',
    Clubs = '_clubs',
    Diamonds = '_diamonds',
  }
  describe('Mapping', () => {
    it('should map enum', () => {
      const input = '_hearts';
      const output = validateAndMap(input as any, stringEnum(SampleStringEnum));
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(SampleStringEnum.Hearts);
    });

    it('should fail on invalid value', () => {
      const input = 'invalid value';
      const output = validateAndMap(input as any, stringEnum(SampleStringEnum));
      expect(output.errors).toBeTruthy();
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              "invalid value",
            ],
            "message": undefined,
            "path": Array [],
            "type": "Enum<\\"_hearts\\",\\"_spades\\",\\"_clubs\\",\\"_diamonds\\">",
            "value": "invalid value",
          },
        ]
      `);
    });
  });
  describe('Unmapping', () => {
    it('should map enum', () => {
      const input = SampleStringEnum.Hearts;
      const output = validateAndUnmap(input, stringEnum(SampleStringEnum));
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe('_hearts');
    });

    it('should fail on invalid value', () => {
      const input = 'invalid value';
      const output = validateAndUnmap(
        input as any,
        stringEnum(SampleStringEnum)
      );
      expect(output.errors).toBeTruthy();
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              "invalid value",
            ],
            "message": undefined,
            "path": Array [],
            "type": "Enum<\\"_hearts\\",\\"_spades\\",\\"_clubs\\",\\"_diamonds\\">",
            "value": "invalid value",
          },
        ]
      `);
    });
  });
});

describe('Number Enum', () => {
  enum SampleNumberEnum {
    Hearts,
    Spades,
    Clubs,
    Diamonds,
  }
  describe('Mapping', () => {
    it('should map enum', () => {
      const input = 0;
      const output = validateAndMap(input as any, numberEnum(SampleNumberEnum));
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(SampleNumberEnum.Hearts);
    });

    it('should map enum from numeric string', () => {
      const input = '0';
      const output = validateAndMap(input as any, numberEnum(SampleNumberEnum));
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(SampleNumberEnum.Hearts);
    });

    it('should fail on invalid value', () => {
      const input = 250;
      const output = validateAndMap(input as any, numberEnum(SampleNumberEnum));
      expect(output.errors).toBeTruthy();
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              250,
            ],
            "message": undefined,
            "path": Array [],
            "type": "Enum<0,1,2,3>",
            "value": 250,
          },
        ]
      `);
    });

    it('should fail on enum string key', () => {
      const input = 'Hearts';
      const output = validateAndMap(input as any, numberEnum(SampleNumberEnum));
      expect(output.errors).toBeTruthy();
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              "Hearts",
            ],
            "message": undefined,
            "path": Array [],
            "type": "Enum<0,1,2,3>",
            "value": "Hearts",
          },
        ]
      `);
    });
  });
  describe('Unmapping', () => {
    it('should map enum', () => {
      const input = SampleNumberEnum.Hearts;
      const output = validateAndUnmap(input, numberEnum(SampleNumberEnum));
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(0);
    });

    it('should map enum from numeric string', () => {
      const input = '0';
      const output = validateAndUnmap(
        input as any,
        numberEnum(SampleNumberEnum)
      );
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toBe(SampleNumberEnum.Hearts);
    });

    it('should fail on invalid value', () => {
      const input = 250;
      const output = validateAndUnmap(
        input as any,
        numberEnum(SampleNumberEnum)
      );
      expect(output.errors).toBeTruthy();
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              250,
            ],
            "message": undefined,
            "path": Array [],
            "type": "Enum<0,1,2,3>",
            "value": 250,
          },
        ]
      `);
    });

    it('should fail on enum string key', () => {
      const input = 'Hearts';
      const output = validateAndUnmap(
        input as any,
        numberEnum(SampleNumberEnum)
      );
      expect(output.errors).toBeTruthy();
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              "Hearts",
            ],
            "message": undefined,
            "path": Array [],
            "type": "Enum<0,1,2,3>",
            "value": "Hearts",
          },
        ]
      `);
    });
  });
});

describe('Lazy', () => {
  let spyFn: any;
  let schema: Schema<string, string>;
  beforeEach(() => {
    spyFn = jest.fn(() => {
      return string();
    });
    schema = lazy(spyFn);
  });
  it('should not call the schema provider fn immediately', () => {
    expect(spyFn).not.toHaveBeenCalled();
  });
  it('should call the schema provider fn on validate', () => {
    validateAndMap('test value', schema);
    expect(spyFn).toBeCalledTimes(1);
  });
  it('should call the schema provider fn only once on multiple validate calls', () => {
    validateAndMap('test value', schema);
    validateAndMap('another value', schema);
    expect(spyFn).toBeCalledTimes(1);
  });
});

describe('Self-Referencing', () => {
  it('should map self-referencing schemas', () => {
    const input: Boss = {
      promotedAt: 123123,
      assistant: {
        department: 'IT',
      },
    };
    const output = validateAndMap(input, bossSchema);
    expect(output.errors).toBeFalsy();
    expect((output as any).result).toStrictEqual({
      promotedAt: 123123,
      assistant: {
        department: 'IT',
      },
    });
  });
});

describe('XML', () => {
  const schema = strictObject({
    'string-attr': [
      'string-attr',
      string(),
      { isAttr: true, xmlName: 'string' },
    ],
    'number-attr': [
      'number-attr',
      number(),
      { isAttr: true, xmlName: 'number' },
    ],
    'string-element': ['string-element', string(), { xmlName: 'string' }],
    'number-element': ['number-element', number(), { xmlName: 'number' }],
  });

  describe('Mapping', () => {
    it('should map from object', () => {
      const output = validateAndMapXml(
        {
          $: { string: 'Attribute String', number: '321321' },
          string: 'Element string',
          number: '123123',
        },
        schema
      );
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual({
        'string-attr': 'Attribute String',
        'number-attr': 321321,
        'string-element': 'Element string',
        'number-element': 123123,
      });
    });

    it('should map from array', () => {
      const arraySchema = array(string());
      const input = ['hello', 'world'];
      const output = validateAndMapXml(input, arraySchema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(input);
    });

    it('should map from array with XML item name', () => {
      const arraySchema = array(string(), { xmlItemName: 'strings' });
      const input = ['hello', 'world'];
      const output = validateAndMapXml({ strings: input }, arraySchema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(input);
    });
  });

  describe('Unmapping', () => {
    it('should map from object', () => {
      const output = validateAndUnmapXml(
        {
          'string-attr': 'Attribute String',
          'number-attr': 321321,
          'string-element': 'Element string',
          'number-element': 123123,
        },
        schema
      );
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual({
        $: { string: 'Attribute String', number: 321321 },
        string: 'Element string',
        number: 123123,
      });
    });

    it('should map from array', () => {
      const arraySchema = array(string());
      const input = ['hello', 'world'];
      const output = validateAndUnmapXml(input, arraySchema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual(input);
    });

    it('should map from array with XML item name', () => {
      const arraySchema = array(string(), { xmlItemName: 'strings' });
      const input = ['hello', 'world'];
      const output = validateAndUnmapXml(input, arraySchema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual({ strings: input });
    });
  });
});
