import { Location } from '@angular/common';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BreakpointObserver } from '@angular/cdk/layout';
import { BrightnessService } from '@app/core/services/brightness.service';
@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.scss'],
})
export class ProyectoComponent implements OnInit, OnDestroy {
  public modeSidenav = 'side';
  public breakpoint: boolean;
  private destroy$: Subject<any> = new Subject<any>();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private location: Location,
    private brightnessSvc: BrightnessService,
    private activatedRoute: ActivatedRoute
  ) {}
  idPost: string;
  ngOnInit(): void {
    this.brightnessSvc.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        // this.brightnessSvc.toggleTheme(res);
      });

    this.breakpointObserver
      .observe('(max-width: 700px)')
      .pipe(
        map((res) => res.matches),
        shareReplay()
      )
      .subscribe((res) => (this.breakpoint = res));
    this.idPost = this.activatedRoute.snapshot.params.uuid;
  }

  onback(): void {
    this.location.back();
  }
  onForward(): void {
    this.location.forward();
  }

  onLogout(): void {}

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
