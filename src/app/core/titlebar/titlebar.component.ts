import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent implements OnInit {

  private win: any;

  constructor(private electronSvc: ElectronService, public location: Location) { }
  ngOnInit(): void {
  }

  minimize(): void {
    this.win = this.electronSvc.remote.getCurrentWindow();
    this.win.minimize();
  }

  maximize(): void {
    this.win = this.electronSvc.remote.getCurrentWindow();
    if (!this.win.isMaximized()) {
      this.win.maximize();
    } else {
      this.win.unmaximize();
    }
  }

  close(): void {
    this.win = this.electronSvc.remote.getCurrentWindow();
    this.win.close();
  }

  reload(): void {
    this.win = this.electronSvc.remote.getCurrentWindow();
    this.win.reload();
  }



  onback(): void {
    this.location.back();
  }
  onForward(): void {
    this.location.forward();
  }



}
