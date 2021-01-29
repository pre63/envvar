declare namespace spazio {
  export function UnsetVariableError(message: any): void
  export class UnsetVariableError {
    constructor(message: any)
    message: any
    name: string
  }

  export function ValueError(message: any): void
  export class ValueError {
    constructor(message: any)
    message: any
    name: string
  }
}


declare function spazio(source: any, source2: any): {
  /**
   * Returns the value of the specified environment variable as a string.
   *
   * @throws if the environment variable is not set and a default is not
   *         specified.
   */
  string(name: string, defaultValue?: string): string

  /**
   * Returns the value of the specified environment variable as a number.
   *
   * @throws if the environment variable is not set and a default is not
   *         specified.
   * @throws if the value of the environment variable does not represent a
   *         number.
   */
  number(name: string, defaultValue?: number): number

  /**
   * Returns the value of the specified environment variable as a boolean.
   *
   * @throws if the environment variable is not set and a default is not
   *         specified.
   * @throws if the value of the environment variable does not represent a
   *         boolean.
   */
  boolean(name: string, defaultValue?: boolean): boolean

  /**
   * Returns the value of the specified environment variable, provided that
   * the value is one of the permissible strings.
   *
   * @throws if the environment variable is not set and a default is not
   *         specified.
   * @throws if the value of the environment variable is not one of the
   *         permissible strings.
   */
  oneOf(name: string, allowedValues: Array<string>, defaultValue?: string): string
}

export = spazio