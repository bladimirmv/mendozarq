
import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

import { map } from 'rxjs/operators';

import { User } from '@models/user.interface';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

/** Constants used to fill up our data base. */
const COLORS: string[] = [
  'maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple', 'fuchsia', 'lime', 'teal',
  'aqua', 'blue', 'navy', 'black', 'gray'
];
const NAMES: string[] = [
  'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
  'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];

@Component({
  selector: 'app-proyects',
  templateUrl: './proyects.component.html',
  styleUrls: ['./proyects.component.scss']
})
export class ProyectsComponent implements OnInit {


  selected: any[] = [];
  selection = new SelectionModel<UserData>(true, []);

  filterValue: string;
  displayedColumns: string[] = ['select', 'name', 'progress', 'color', 'g1', 'g2', 'g3', 'g4'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  constructor() {



    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));
    this.dataSource = new MatTableDataSource(users);

  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.selection.changed
      .pipe(map(a => a.source))
      .subscribe(data => this.selected = data.selected);
  }

  applyFilter(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  isAllSelected(): any {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  clearCheckbox(): void {
    this.selection.clear();
  }

  checkboxLabel(row?: UserData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }
}












function createNewUser(id: number): UserData {
  const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

  return {
    id: id.toString(),
    name,
    progress: Math.round(Math.random() * 100).toString(),
    color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
  };
}
