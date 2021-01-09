import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  socketStatus: boolean = false;

  // private socket: any;
  // private socket: Socket;
  constructor(private socket: Socket) {
    // this.socket = io('http://localhost:3000');
    this.checkStatus();
  }

  checkStatus() {
    console.log('hola?');

    this.socket.on('connect', () => {
      console.log('Se conecto al socket');
      this.socketStatus = true;
    });

    this.socket.on('msg', (data) => {
      console.log('llego esto: ', data);
      this.socketStatus = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Se desconecto al socket');
      this.socketStatus = true;
    });
  }
}
