import { mergeHeaders, assertHeaders } from '../../src/http/httpHeaders';

describe('HTTP Headers', () => {
  describe('Merge headers', () => {
    test.each([
      [
        'should merge disjoint headers map',
        { value1: 'value1', Value2: 'value2' },
        { value3: 'value2', Value4: 'value4' },
        {
          value1: 'value1',
          Value2: 'value2',
          value3: 'value2',
          Value4: 'value4',
        },
      ],
      [
        'should override same-case header with new value',
        { value1: 'value1', 'another-header': 'test value' },
        { value1: 'value2' },
        { value1: 'value2', 'another-header': 'test value' },
      ],
      [
        'should override different-case header with new value',
        { value1: 'value1', 'another-header': 'test value' },
        { VaLue1: 'value2' },
        { VaLue1: 'value2', 'another-header': 'test value' },
      ],
      [
        'should merge in empty headers',
        {},
        { value1: 'value2' },
        { value1: 'value2' },
      ],
      [
        'should merge into empty headers',
        { value1: 'value2' },
        {},
        { value1: 'value2' },
      ],
    ])(
      '%s',
      (
        _: string,
        headers: Record<string, string>,
        headersToMerge: Record<string, string>,
        expectedResult: Record<string, string>
      ) => {
        mergeHeaders(headers, headersToMerge);
        expect(headers).toStrictEqual(expectedResult);
      }
    );
  });

  describe('Assert headers', () => {
    it('should not throw for valid headers', () => {
      assertHeaders({
        VaLue1: 'value2',
        'another-header': 'test value',
      });
    });

    it('should not throw for empty headers', () => {
      assertHeaders({});
    });

    it('should not throw for empty header values', () => {
      assertHeaders({
        value: '',
      });
    });

    it('should throw for non-object values', () => {
      expect.hasAssertions();
      try {
        assertHeaders('header');
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error.message).toBe('Headers must be an object.');
      }
    });

    it('should throw on invalid header names', () => {
      expect.hasAssertions();
      try {
        assertHeaders({ 'invalid header': 'test' });
      } catch (error) {
        expect(error.message).toBe(
          '"invalid header" is not a valid header name.'
        );
      }
    });

    it('should throw on invalid header values', () => {
      expect.hasAssertions();
      try {
        assertHeaders({ 'header-name': 123 });
      } catch (error) {
        expect(error).toBeInstanceOf(TypeError);
        expect(error.message).toBe(
          'Header value must be string but number provided.'
        );
      }
    });
  });
});
