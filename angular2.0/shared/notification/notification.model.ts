export enum MessageType {
  success,
  // fail,
  info,
  warning,
  // caution,
  danger,
  // critical
}

export class AppMessage {
  constructor(public msgType: MessageType, public title: string, public message: string) { }
}
