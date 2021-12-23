import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { WebsocketService } from '@services/sockets/websocket.service';
import { Logs } from '@models/logs/logs.interface';

import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { InfoLogComponent } from '../info-log/info-log.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public Logs: Logs[] = [] as Logs[];

  constructor(private wsService: WebsocketService, private dialog: MatDialog) {}

  ngOnInit(): void {
    moment.locale('es');

    this.wsService.emit('ws:getLogs');
    this.wsService.listen('ws:getLogs').subscribe((logs: Logs[]) => {
      this.Logs = logs;
    });
  }

  public formatDate(date: Date): string {
    return moment(date).fromNow();
  }

  public openInfo(log: Logs): void {
    this.dialog.open(InfoLogComponent, {
      data: log,
    });
  }
}
