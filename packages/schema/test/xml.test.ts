import {
  array,
  number,
  strictObject,
  string,
  validateAndMapXml,
  validateAndUnmapXml,
} from '../src';

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
