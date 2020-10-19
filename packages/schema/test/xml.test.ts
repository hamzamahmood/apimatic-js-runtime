import {
  array,
  number,
  strictObject,
  string,
  validateAndMapXml,
  validateAndUnmapXml,
  object,
} from '../src';

describe('XML', () => {
  describe('Strict Object', () => {
    const schema = strictObject({
      'string-attr': ['string-attr-s', string(), { isAttr: true }],
      'number-attr': [
        'number-attr',
        number(),
        { isAttr: true, xmlName: 'number' },
      ],
      'string-element': ['string-element', string(), { xmlName: 'string' }],
      'number-element': ['number-element-s', number()],
    });

    describe('Mapping', () => {
      it('should map schema with elements and attributes', () => {
        const output = validateAndMapXml(
          {
            $: { 'string-attr-s': 'Attribute String', number: '321321' },
            string: 'Element string',
            'number-element-s': '123123',
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

      it('should map schema with elements only', () => {
        const schema = strictObject({
          element: ['an-element', string()],
        });
        const input = {
          'an-element': 'test value',
        };
        const output = validateAndMapXml(input, schema);
        expect(output.errors).toBeFalsy();
        expect((output as any).result).toStrictEqual({
          element: 'test value',
        });
      });

      it('should fail on invalid types', () => {
        const output = validateAndMapXml(123123, schema);
        expect(output.errors).toBeTruthy();
        expect(output.errors).toMatchInlineSnapshot(`
          Array [
            Object {
              "branch": Array [
                123123,
              ],
              "message": undefined,
              "path": Array [],
              "type": "StrictObject<{string-attr,number-attr,string-element,number-element}>",
              "value": 123123,
            },
          ]
        `);
      });
    });

    describe('Unmapping', () => {
      it('should map with elements and attributes', () => {
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
          $: { 'string-attr-s': 'Attribute String', number: 321321 },
          string: 'Element string',
          'number-element-s': 123123,
        });
      });

      it('should fail on invalid types', () => {
        const output = validateAndUnmapXml(123123 as any, schema);
        expect(output.errors).toBeTruthy();
        expect(output.errors).toMatchInlineSnapshot(`
          Array [
            Object {
              "branch": Array [
                123123,
              ],
              "message": undefined,
              "path": Array [],
              "type": "StrictObject<{string-attr,number-attr,string-element,number-element}>",
              "value": 123123,
            },
          ]
        `);
      });
    });
  });

  describe('Object', () => {
    const schema = object({
      'string-attr': ['string-attr-s', string(), { isAttr: true }],
      'number-attr': [
        'number-attr',
        number(),
        { isAttr: true, xmlName: 'number' },
      ],
      'string-element': ['string-element', string(), { xmlName: 'string' }],
      'number-element': ['number-element-s', number()],
    });

    describe('Mapping', () => {
      it('should map schema with elements and attributes', () => {
        const output = validateAndMapXml(
          {
            $: { 'string-attr-s': 'Attribute String', number: '321321' },
            string: 'Element string',
            'number-element-s': '123123',
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

      it('should map schema with elements only', () => {
        const schema = object({
          element: ['an-element', string()],
        });
        const input = {
          'an-element': 'test value',
        };
        const output = validateAndMapXml(input, schema);
        expect(output.errors).toBeFalsy();
        expect((output as any).result).toStrictEqual({
          element: 'test value',
        });
      });

      it('should map schema with additional attributes', () => {
        const output = validateAndMapXml(
          {
            $: {
              'string-attr-s': 'Attribute String',
              number: '321321',
              'additional-attr': 'test value',
            },
            string: 'Element string',
            'number-element-s': '123123',
          },
          schema
        );
        expect(output.errors).toBeFalsy();
        expect((output as any).result).toStrictEqual({
          $: { 'additional-attr': 'test value' },
          'string-attr': 'Attribute String',
          'number-attr': 321321,
          'string-element': 'Element string',
          'number-element': 123123,
        });
      });

      it('should map schema with additional elements', () => {
        const output = validateAndMapXml(
          {
            $: { 'string-attr-s': 'Attribute String', number: '321321' },
            string: 'Element string',
            'number-element-s': '123123',
            'additional-ele': 'test value',
          },
          schema
        );
        expect(output.errors).toBeFalsy();
        expect((output as any).result).toStrictEqual({
          'string-attr': 'Attribute String',
          'number-attr': 321321,
          'string-element': 'Element string',
          'number-element': 123123,
          'additional-ele': 'test value',
        });
      });

      it('should fail on invalid types', () => {
        const output = validateAndMapXml(123123, schema);
        expect(output.errors).toBeTruthy();
        expect(output.errors).toMatchInlineSnapshot(`
          Array [
            Object {
              "branch": Array [
                123123,
              ],
              "message": undefined,
              "path": Array [],
              "type": "Object<{string-attr,number-attr,string-element,number-element,...}>",
              "value": 123123,
            },
          ]
        `);
      });
    });

    describe('Unmapping', () => {
      it('should map with elements and attributes', () => {
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
          $: { 'string-attr-s': 'Attribute String', number: 321321 },
          string: 'Element string',
          'number-element-s': 123123,
        });
      });

      it('should map schema with additional attributes', () => {
        const output = validateAndUnmapXml(
          {
            $: { 'additional-attr': 'test value' },
            'string-attr': 'Attribute String',
            'number-attr': 321321,
            'string-element': 'Element string',
            'number-element': 123123,
          },
          schema
        );
        expect(output.errors).toBeFalsy();
        expect((output as any).result).toStrictEqual({
          $: {
            'string-attr-s': 'Attribute String',
            number: 321321,
            'additional-attr': 'test value',
          },
          string: 'Element string',
          'number-element-s': 123123,
        });
      });

      it('should map schema with additional elements', () => {
        const output = validateAndUnmapXml(
          {
            'string-attr': 'Attribute String',
            'number-attr': 321321,
            'string-element': 'Element string',
            'number-element': 123123,
            'additional-ele': 'test value',
          },
          schema
        );
        expect(output.errors).toBeFalsy();
        expect((output as any).result).toStrictEqual({
          $: { 'string-attr-s': 'Attribute String', number: 321321 },
          string: 'Element string',
          'number-element-s': 123123,
          'additional-ele': 'test value',
        });
      });

      it('should fail on invalid types', () => {
        const output = validateAndUnmapXml(123123 as any, schema);
        expect(output.errors).toBeTruthy();
        expect(output.errors).toMatchInlineSnapshot(`
          Array [
            Object {
              "branch": Array [
                123123,
              ],
              "message": undefined,
              "path": Array [],
              "type": "Object<{string-attr,number-attr,string-element,number-element,...}>",
              "value": 123123,
            },
          ]
        `);
      });
    });
  });

  describe('Array', () => {
    describe('Mapping', () => {
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
});
