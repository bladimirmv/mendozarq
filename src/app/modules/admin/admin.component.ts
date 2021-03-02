import { LocationBarService } from '../../core/services/mendozarq/location-bar.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { BrightnessService } from './../../core/services/brightness.service';
import { Location } from '@angular/common';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { Subscription, Observable, of, Subject } from 'rxjs';
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
  private destroy$: Subject<any> = new Subject<any>();





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
    this.breakpointObserver.observe('(max-width: 700px)')
      .pipe(
        takeUntil(this.destroy$),
        map(res => res.matches),
        shareReplay()
      ).subscribe(res => this.breakpoint = res);

    this.locationBarSvc.pushLocation({
      icon: 'dashboard',
      name: 'Administracion',
      link: '/admin'
    });

  }
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
    this.locationBarSvc.deleteLocation();
  }
  onback(): void {
    this.location.back();
  }
  onForward(): void {
    this.location.forward();
  }

  onLogout(): void {
    this.authSvc.logout();
  }



}
