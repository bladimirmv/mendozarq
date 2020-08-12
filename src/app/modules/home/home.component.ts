import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { ExampleModalComponent } from './components/example-modal/example-modal.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog) { }
  ngOnInit(): void {

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
