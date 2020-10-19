import {
  optional,
  string,
  validateAndMapXml,
  validateAndUnmapXml,
  dictWithXmlEntries,
} from '../../src';

describe('Dictionary with XML Entries', () => {
  describe('Mapping XML', () => {
    it('should map valid dictionary', () => {
      const input = {
        entry: [
          { $: { key: 'key1' }, _: 'hello' },
          { $: { key: 'key2' }, _: 'world' },
        ],
      };
      const schema = dictWithXmlEntries(string());
      const output = validateAndMapXml(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual({
        key1: 'hello',
        key2: 'world',
      });
    });

    it('should map single-entry dictionary', () => {
      const input = {
        entry: { $: { key: 'key1' }, _: 'hello' },
      };
      const schema = dictWithXmlEntries(string());
      const output = validateAndMapXml(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual({
        key1: 'hello',
      });
    });

    it('should map empty dictionary', () => {
      const input = {};
      const schema = dictWithXmlEntries(string());
      const output = validateAndMapXml(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual({});
    });

    it('should map dictionary with optional items', () => {
      const input = {
        entry: [{ $: { key: 'key1' }, _: 'hello' }, { $: { key: 'key2' } }],
      };
      const schema = dictWithXmlEntries(optional(string()));
      const output = validateAndMapXml(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual({
        key1: 'hello',
        key2: undefined,
      });
    });

    it('should fail on missing key attribute', () => {
      const input = {
        entry: [{ $: { nokey: 'key1' }, _: 'hello' }],
      };
      const schema = dictWithXmlEntries(string());
      const output = validateAndMapXml(input, schema);
      expect(output.errors).toBeTruthy();
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Object {
                "entry": Array [
                  Object {
                    "$": Object {
                      "nokey": "key1",
                    },
                    "_": "hello",
                  },
                ],
              },
            ],
            "message": "Expected \\"entry\\" element to have an attribute named \\"key\\".

        Given value: {\\"entry\\":[{\\"$\\":{\\"nokey\\":\\"key1\\"},\\"_\\":\\"hello\\"}]}
        Type: 'object'
        Expected type: 'Record<string,string>'",
            "path": Array [],
            "type": "Record<string,string>",
            "value": Object {
              "entry": Array [
                Object {
                  "$": Object {
                    "nokey": "key1",
                  },
                  "_": "hello",
                },
              ],
            },
          },
        ]
      `);
    });

    it('should fail on missing content when not item schema is not optional', () => {
      const input = {
        entry: [{ $: { key: 'key1' } }],
      };
      const schema = dictWithXmlEntries(string());
      const output = validateAndMapXml(input, schema);
      expect(output.errors).toBeTruthy();
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Object {
                "entry": Array [
                  Object {
                    "$": Object {
                      "key": "key1",
                    },
                  },
                ],
              },
              undefined,
            ],
            "message": "Expected value to be of type 'string' but found 'undefined'.

        Given value: undefined
        Type: 'undefined'
        Expected type: 'string'
        Path: key1",
            "path": Array [
              "key1",
            ],
            "type": "string",
            "value": undefined,
          },
        ]
      `);
    });

    it('should fail if not XML element object', () => {
      const input = {
        entry: 'invalid value',
      };
      const schema = dictWithXmlEntries(string());
      const output = validateAndMapXml(input, schema);
      expect(output.errors).toBeTruthy();
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Object {
                "entry": "invalid value",
              },
            ],
            "message": "Expected \\"entry\\" to be an XML element.

        Given value: {\\"entry\\":\\"invalid value\\"}
        Type: 'object'
        Expected type: 'Record<string,string>'",
            "path": Array [],
            "type": "Record<string,string>",
            "value": Object {
              "entry": "invalid value",
            },
          },
        ]
      `);
    });

    it('should fail on other types', () => {
      const input = 123123;
      const schema = dictWithXmlEntries(string());
      const output = validateAndMapXml(input as any, schema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              123123,
            ],
            "message": "Expected value to be of type 'Record<string,string>' but found 'number'.

        Given value: 123123
        Type: 'number'
        Expected type: 'Record<string,string>'",
            "path": Array [],
            "type": "Record<string,string>",
            "value": 123123,
          },
        ]
      `);
    });

    it('should fail on item schema invalidation', () => {
      const input = {
        entry: [
          { $: { key: 'key1' }, _: 'hello' },
          { $: { key: 'key2' }, _: false },
        ],
      };
      const schema = dictWithXmlEntries(string());
      const output = validateAndMapXml(input as any, schema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              Object {
                "entry": Array [
                  Object {
                    "$": Object {
                      "key": "key1",
                    },
                    "_": "hello",
                  },
                  Object {
                    "$": Object {
                      "key": "key2",
                    },
                    "_": false,
                  },
                ],
              },
              false,
            ],
            "message": "Expected value to be of type 'string' but found 'boolean'.

        Given value: false
        Type: 'boolean'
        Expected type: 'string'
        Path: key2",
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
  describe('Unmapping XML', () => {
    it('should map valid dictionary', () => {
      const input = {
        key1: 'hello',
        key2: 'world',
      };
      const schema = dictWithXmlEntries(string());
      const output = validateAndUnmapXml(input, schema);
      expect(output.errors).toBeFalsy();
      expect((output as any).result).toStrictEqual({
        entry: [
          { $: { key: 'key1' }, _: 'hello' },
          { $: { key: 'key2' }, _: 'world' },
        ],
      });
    });

    it('should fail on other types', () => {
      const input = 123123;
      const schema = dictWithXmlEntries(string());
      const output = validateAndUnmapXml(input as any, schema);
      expect((output as any).result).toBeUndefined();
      expect(output.errors).toHaveLength(1);
      expect(output.errors).toMatchInlineSnapshot(`
        Array [
          Object {
            "branch": Array [
              123123,
            ],
            "message": "Expected value to be of type 'Record<string,string>' but found 'number'.

        Given value: 123123
        Type: 'number'
        Expected type: 'Record<string,string>'",
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
      const schema = dictWithXmlEntries(string());
      const output = validateAndUnmapXml(input as any, schema);
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
            "message": "Expected value to be of type 'string' but found 'boolean'.

        Given value: false
        Type: 'boolean'
        Expected type: 'string'
        Path: key2",
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
