import { Component, OnInit, Input, Pipe } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})


export class ButtonComponent implements OnInit {

  @Input() color;
  constructor() { }

  ngOnInit(): void {

  }

}
