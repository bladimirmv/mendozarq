import { HerramientaService } from '../../core/services/mendozarq/herramienta.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-herramienta',
  templateUrl: './herramienta.component.html',
  styleUrls: ['./herramienta.component.scss']
})
export class HerramientaComponent implements OnInit {

  constructor(
    private herramientaSvc: HerramientaService
  ) { }

  ngOnInit(): void {
    // this.herramientaSvc.addHerramienta()
  }



}
