import { lazy, Schema, string, validateAndMap } from '../../src';

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
  it('should return type as Lazy<Type>', () => {
    expect(schema.type()).toBe('Lazy<string>');
  });
});
