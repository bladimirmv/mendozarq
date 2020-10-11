import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-participantes',
  templateUrl: './participantes.component.html',
  styleUrls: ['./participantes.component.scss']
})
export class ParticipantesComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute) { }
  ngOnInit(): void {
    const idPost = this.activatedRoute.snapshot.parent.parent.params.id;
    console.log(idPost);

  }

}
