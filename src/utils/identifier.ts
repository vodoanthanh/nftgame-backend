export default class Identifier {
  static encode(id: string, type: string) {
    return `${id}_${type}`;
  }

  static decode(code: string) {
    return code.split('_');
  }
}
