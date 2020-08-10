import { Component, OnInit, Input } from '@angular/core';
export type typeButton = 'primary' | 'secondary' | 'warn' | 'accent';
@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})


export class ButtonComponent implements OnInit {

  @Input() color: typeButton;
  constructor() { }

  ngOnInit(): void {
    console.log(this.color);

  }

}
