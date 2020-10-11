import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.component.html',
  styleUrls: ['./visitas.component.scss']
})
export class VisitasComponent implements OnInit {
  idPost: string;
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.idPost = this.activatedRoute.snapshot.parent.parent.params.id;
    console.log(this.idPost);
  }

}
