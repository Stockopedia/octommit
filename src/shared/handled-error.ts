export class HandledError implements Error {
  public readonly name = "HandledError";
  public readonly message!: string;
  constructor(message: string, readonly baseError: Error) {
    this.message = `${message} - cause: ${baseError.message}`;
  }
}
