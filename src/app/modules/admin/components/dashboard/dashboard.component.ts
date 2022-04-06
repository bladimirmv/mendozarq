import { UsuarioService } from '@services/auth/usuario.service';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';

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
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  public Logs: Logs[] = [] as Logs[];
  private destroy$: Subject<any> = new Subject<any>();
  public stats = {
    administrador: 0,
    arquitecto: 0,
    vendedor: 0,
    cliente: 0,
  };

  constructor(
    private wsService: WebsocketService,
    private dialog: MatDialog,
    private _usrSvc: UsuarioService
  ) {}

  ngAfterViewInit(): void {
    moment.locale('es');
    this.wsService.checkStatus();
  }

  ngOnInit(): void {
    this.wsService.emit('ws:getLogs');
    this.getDataSocket();
    this._usrSvc.getAllStatsUsuarios().subscribe((stats) => {
      this.stats = stats;
      console.log(stats);
    });
  }

  getDataSocket(): void {
    this.wsService
      .listen('ws:getLogs')
      .pipe(takeUntil(this.destroy$))
      .subscribe((logs: Logs[]) => {
        this.Logs = logs;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
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
