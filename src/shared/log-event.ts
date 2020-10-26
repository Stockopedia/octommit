export enum LogType {
  info,
  error
}
export class LogEvent { 
  constructor(readonly type: LogType, readonly message: string) {}
}