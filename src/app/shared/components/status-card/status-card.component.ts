import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-card',
  templateUrl: './status-card.component.html',
  styleUrls: ['./status-card.component.scss']
})
export class StatusCardComponent implements OnInit {
  public fullColor: string = 'white';
  @Input() color: string;
  @Input() icon: string;


  constructor() {
  }

  ngOnInit(): void {
    this.fullColor = `var(--${this.color.trim()})`;
  }

}
