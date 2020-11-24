export class HandledError extends Error {
  constructor(readonly message: string, readonly baseError: Error) {
    super(`${message} - cause: ${baseError.message}`);
  }
}
