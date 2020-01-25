import { Injectable, EventEmitter } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../environments/environment';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private webSocketUrl = environment.restUrl;
  private socket;
  public socketStream: Subject<any>;
  public connectionEvent = new EventEmitter();
  constructor() {
    this.socketStream = <Subject<any>>this.connect().pipe(map((resonse: any): any => {
      // console.log("Response: ", resonse);
      return resonse;
    }));
  }

  connect(): Subject<MessageEvent> {
    this.socket = io(this.webSocketUrl);
    const socketObservable = new Observable(observer => {
      this.socket.on('message', (data) => {
        console.log('Received message from Websocket Server');
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });

    const socketObserver = {
      next: (data: object) => {
        this.socket.emit('message', data);
      },
    };
    return Subject.create(socketObserver, socketObservable);
  }
}
