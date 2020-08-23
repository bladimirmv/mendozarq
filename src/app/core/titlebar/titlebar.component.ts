import { Component, OnInit } from '@angular/core';

import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent implements OnInit {

  constructor(private electronSvc: ElectronService) { }
  ngOnInit(): void {

  }

  minimize(): void {
    const win = this.electronSvc.remote.getCurrentWindow();
    console.log('min');

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


}
