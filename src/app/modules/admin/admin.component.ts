import { Location } from '@angular/common';
import { map, shareReplay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { BreakpointObserver } from '@angular/cdk/layout';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  public modeSidenav = 'side';
  public breakpoint: boolean;
  private unsubscribe$: Subscription;

  gg: any;

  constructor(private breakpointObserver: BreakpointObserver, private location: Location) {

  }


  ngOnInit(): void {
    this.unsubscribe$ = this.breakpointObserver.observe('(max-width: 700px)')
      .pipe(
        map(res => res.matches),
        shareReplay()
      ).subscribe(res => this.breakpoint = res);
    console.log(this.unsubscribe$);




  }

  onback(): void {

    this.location.back();
  }
  onForward(): void {
    this.location.forward();
  }

  onLogout(): void {

  }

  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
  }

}