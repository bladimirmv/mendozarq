import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent implements OnInit {



  constructor(private electronSvc: ElectronService, public location: Location) { }
  ngOnInit(): void {
  }

  minimize(): void {
    const win = this.electronSvc.remote.getCurrentWindow();
    win.minimize();
  }
  maximize(): void {
    const win = this.electronSvc.remote.getCurrentWindow();
    if (!win.isMaximized()) {
      win.maximize();
    } else {
      win.unmaximize();
    }
  }
  close(): void {
    const win = this.electronSvc.remote.getCurrentWindow();
    win.close();
  }

  reload(): void {
    const win = this.electronSvc.remote.getCurrentWindow();
    win.reload();
  }



  onback(): void {
    this.location.back();
  }
  onForward(): void {
    this.location.forward();
  }



}
