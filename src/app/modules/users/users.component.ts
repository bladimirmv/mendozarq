import { Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';

import { map } from 'rxjs/operators';

import { User } from '@models/user.interface';
import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UsersComponent implements OnInit {
  expandedElement: User | null;

  selected: User[] = [];
  selection = new SelectionModel<User>(true, []);
  filterValue: string;
  // displayedColumns: string[] = ['seleccion', 'docid', 'rol', 'nombre', 'apellidos', 'celular', 'direccion', 'correo', 'edit'];
  displayedColumns: string[] = ['seleccion', 'rol', 'nombre', 'apellidos', 'edit'];

  dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  constructor() {
    const data: User[] = [
      {
        docid: 'DADASD5DAS4D5AS4',
        nombre: 'Bladimir',
        apellidos: 'Medrano Vargas',
        celular: 69509449,
        rol: 'administrador',
        direccion: 'Avenida Segunda entre marina nuñes del prado',
        correo: 'bladimilmedranoblod@gmail.com'
      },
      {
        docid: 'DADASD5DAS4D5AS4',
        nombre: 'Bladimir',
        apellidos: 'Medrano Vargas',
        celular: 46545644566,
        rol: 'administrador',
        direccion: 'Avenida Segunda entre marina nuñes del prado',
        correo: 'bladimilmedranoblod@gmail.com'
      }
    ];
    this.dataSource = new MatTableDataSource(data);
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.selection.changed
      .pipe(map(a => a.source))
      .subscribe(data => this.selected = data.selected);
  }


  deleteUser(): void {
    console.log(this.selected);
  }

  editUser(user: User): void {
    console.log(user);
  }
  // ====================================================================
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

  checkboxLabel(row?: User): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.nombre}`;
  }
}
