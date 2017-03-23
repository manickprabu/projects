import { Component, OnInit, Input } from '@angular/core';
import { AppMessage, MessageType } from './notification.model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html'
})
export class NotificationComponent {

  @Input() message?: AppMessage;

  constructor() {

   }

  private notify(msg: AppMessage) {
    this.message = new AppMessage(msg.msgType, msg.title, msg.message);
  }

  sucess(title: string, message: string) {
    this.notify(new AppMessage(MessageType.success, title, message));
  }

  info(title: string, message: string) {
    this.notify(new AppMessage(MessageType.info, title, message));
  }

  warning(title: string, message: string) {
    this.notify(new AppMessage(MessageType.warning, title, message));
  }

  danger(title: string, message: string) {
    this.notify(new AppMessage(MessageType.danger, title, message));
  }

  getClass() {
    const cls = 'alert alert-' + MessageType[this.message.msgType];
    return cls;
  }

}
