import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit(): void {
  }

  onBack(): void {
    this.location.back();
  }

}
