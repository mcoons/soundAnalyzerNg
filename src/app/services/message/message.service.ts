
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() {
    console.log('Message Service Constructor');
  }

  // Observable string sources
  private messageAnnouncedSource = new Subject<string>();

  // Observable string streams
  messageAnnounced$ = this.messageAnnouncedSource.asObservable();

  // Service message commands
  announceMessage(message: string) {
    this.messageAnnouncedSource.next(message);
  }

}
