class AnyError extends Error {
  constructor(name: string, message: string) {
    super()

    this.name = name
    this.message = message
  }
}

export class Logger {
  constructor(private scope: string) {}

  private get prefix() {
    return `[${this.scope}]`
  }

  public log(...args: unknown[]) {
    console.log(this.prefix, ...args)
  }

  public warn(...args: unknown[]) {
    console.warn(this.prefix, ...args)
  }

  public error(message: string) {
    try {
      throw new AnyError(this.prefix, message)
    } catch (error) {
      console.error(error)
    }
  }
}
