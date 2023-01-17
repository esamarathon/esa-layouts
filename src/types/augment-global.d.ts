export declare global {
  /**
   * Fix for read only arrays not being typed correctly when checked with Array.isArray.
   * See: https://github.com/microsoft/TypeScript/issues/17002
   */
  interface ArrayConstructor {
    isArray(arg: unknown): arg is unknown[] | readonly unknown[];
  }
}
