import { Location } from '@angular/common';
import { map, shareReplay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BreakpointObserver } from '@angular/cdk/layout';
@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.scss']
})
export class ProyectoComponent implements OnInit, OnDestroy {
  public modeSidenav = 'side';
  public breakpoint: boolean;
  private unsubscribe$: Subscription;

  constructor(private breakpointObserver: BreakpointObserver, private location: Location,
    private activatedRoute: ActivatedRoute) {
  }
  idPost: string;
  ngOnInit(): void {
    this.unsubscribe$ = this.breakpointObserver.observe('(max-width: 700px)')
      .pipe(
        map(res => res.matches),
        shareReplay()
      ).subscribe(res => this.breakpoint = res);
    this.idPost = this.activatedRoute.snapshot.params.uuid;


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
