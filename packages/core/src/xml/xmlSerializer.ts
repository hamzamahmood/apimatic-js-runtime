export interface XmlSerializerInterface {
  xmlSerialize: (rootName: string, value: unknown) => string;
  xmlDeserialize: (rootName: string, xmlString: string) => Promise<any>;
}

export class XmlSerialization {
  public xmlSerialize(_rootName: string, _value: unknown): string {
    throw new Error('XML serialization is not available.');
  }

  public xmlDeserialize(_rootName: string, _xmlString: string): Promise<any> {
    throw new Error('XML deserialization is not available.');
  }
}
