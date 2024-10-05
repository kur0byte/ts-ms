/**
 * @abstract ValueObject
 * @example class Email extends ValueObject<{ email: string }>
 * @returns ValueObject
 * @template T
 * @property {T} props
 */
export abstract class ValueObject<T extends Record<string, unknown>> {
  protected readonly props: T;

  /**
   * @param {T} props
   * @returns ValueObject
   */
  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  /**
   * equals
   * @param {ValueObject<T>} vo
   * @returns boolean
   */
  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
