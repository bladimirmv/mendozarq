import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { ExampleModalComponent } from './components/example-modal/example-modal.component';


import { ElectronService } from 'ngx-electron';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog,
    private electronSvc: ElectronService
  ) { }
  ngOnInit(): void {

  }


  min(): void {
    const remote = this.electronSvc.remote.getCurrentWindow();
    // remote.minimize();

    if (!remote.isMaximized()) {
      remote.maximize();
    } else {
      remote.unmaximize();
    }

    // remote.close();

  }

  openSnackBar(): void {
    this.snackBar.open('message', 'action', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }


  onChangeLink(): void {
    this.router.navigate(['/contact-us']);
  }

  openDialog(): void {
    this.dialog.open(ExampleModalComponent);
  }
}
