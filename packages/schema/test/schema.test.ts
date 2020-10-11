import {
  array,
  boolean,
  defaults,
  dict,
  literal,
  nullable,
  number,
  object,
  optional,
  SchemaMappedType,
  SchemaType,
  strictObject,
  string,
  unknown,
  validateAndMap,
  validateAndUnmap,
} from '../src';

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

    it('should fail on other types', () => {
      const input = 'hello world';
      const schema = boolean();
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
            "type": "boolean",
            "value": "hello world",
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
  describe('Mapping', () => {
    const userSchema = strictObject({
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
    const userSchema = strictObject({
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
