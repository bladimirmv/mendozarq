import { LocationBarService } from './../../core/services/location-bar.service';
import { AuthService } from '@services/auth.service';
import { BrightnessService } from './../../core/services/brightness.service';
import { Location } from '@angular/common';
import { map, shareReplay } from 'rxjs/operators';
import { Subscription, Observable, of } from 'rxjs';
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

  $usr: Observable<any>;




  constructor(
    private breakpointObserver: BreakpointObserver,
    private location: Location,
    public brightnessSvc: BrightnessService,
    public authSvc: AuthService,
    public locationBarSvc: LocationBarService) {
  }

  onBrightness(e): void {
    this.brightnessSvc.ChangeValue(e.value);
  }

  ngOnInit(): void {
    this.unsubscribe$ = this.breakpointObserver.observe('(max-width: 700px)')
      .pipe(
        map(res => res.matches),
        shareReplay()
      ).subscribe(res => this.breakpoint = res);
    this.$usr = of(false);

    this.locationBarSvc.pushLocation({
      icon: 'dashboard',
      name: 'Administracion',
      link: '/admin'
    });

  }
  ngOnDestroy(): void {
    this.unsubscribe$.unsubscribe();
    this.locationBarSvc.deleteLocation();
  }
  onback(): void {
    this.location.back();
  }
  onForward(): void {
    this.location.forward();
  }

  onLogout(): void {

  }



}
