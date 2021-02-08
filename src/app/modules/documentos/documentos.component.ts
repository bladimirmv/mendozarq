import { Component, HostListener, OnInit } from '@angular/core';
import { Event } from 'electron';
import { EventEmitter } from 'events';
export interface Section {
  name: string;
  updated: Date;
}
@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent implements OnInit {

  nombre: string = 'bladimir';


  @HostListener('window:click', ['$event'])
  onClick(event) {
    document.querySelector('#main_contextmenu').classList.remove('active');
    document.querySelector('#folder_contextmenu').classList.remove('active');
    document.querySelector('#document_contextmenu').classList.remove('active');
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: any) {
    event.preventDefault();
    const main_menu = document.querySelector("#main_contextmenu") as HTMLDivElement;

    main_menu.style.top = event.offsetY + "px";
    main_menu.style.left = event.offsetX + "px";

    console.log(event);


    if (event.target.id !== 'content' && event.target.id !== 'list') {
      main_menu.classList.remove('active');
    } else {
      const folder_menu = document.querySelector("#folder_contextmenu") as HTMLDivElement;
      const doc_menu = document.querySelector("#document_contextmenu") as HTMLDivElement;
      folder_menu.classList.remove('active');
      doc_menu.classList.remove('active');

      main_menu.classList.add('active');
    }
  }


  notes: Section[] = [
    {
      name: 'Planos',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel Remodel ',
      updated: new Date('1/18/16'),
    },
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    },
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    },
    {
      name: 'Vacation Itinerary',
      updated: new Date('2/20/16'),
    },
    {
      name: 'Kitchen Remodel',
      updated: new Date('1/18/16'),
    },
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    }
  ];
  constructor() {

  }

  ngOnInit(): void {


    this.onFolderContextMenu();
    this.onDocumentContextMenu();
  }

  onFolderContextMenu(): void {
    const folders = document.querySelectorAll('#folder');

    folders.forEach((folder) => {
      folder.addEventListener('contextmenu', function (event: any) {
        event.preventDefault();

        const folder_menu = document.querySelector("#folder_contextmenu") as HTMLDivElement;
        folder_menu.style.top = event.pageY + "px";
        folder_menu.style.left = event.pageX + "px";
        folder_menu.classList.add('active');
      });

    });
  }

  onDocumentContextMenu(): void {

  }







}
