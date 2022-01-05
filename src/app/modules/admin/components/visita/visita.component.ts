import { catchError, map, shareReplay, takeUntil } from 'rxjs/operators';
import { Subject, Subscription, throwError } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BreakpointObserver } from '@angular/cdk/layout';
import { VisitaProyectoService } from '@app/core/services/mendozarq/visita-proyecto.service';
import { VisitaProyecto } from '@app/shared/models/mendozarq/visita.proyecto.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '@app/core/services/auth/auth.service';
import { BrightnessService } from '@app/core/services/brightness.service';
@Component({
  selector: 'app-visita',
  templateUrl: './visita.component.html',
  styleUrls: ['./visita.component.scss'],
})
export class VisitaComponent implements OnInit, OnDestroy {
  public modeSidenav = 'side';
  public breakpoint: boolean;

  private destroy$: Subject<any> = new Subject<any>();
  private uuidProyecto: string;
  private uuidVisita: string;
  public urlBack: string;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private activatedRoute: ActivatedRoute,
    private visitaProyectoSvc: VisitaProyectoService,
    private brightnessSvc: BrightnessService,
    private router: Router,
    private authSvc: AuthService
  ) {
    this.uuidVisita = this.activatedRoute.snapshot.params.uuid;
    this.checkProyecto();
  }
  ngOnInit(): void {
    this.brightnessSvc.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {});

    this.breakpointObserver
      .observe('(max-width: 700px)')
      .pipe(
        takeUntil(this.destroy$),
        map((res) => res.matches),
        shareReplay()
      )
      .subscribe((res) => (this.breakpoint = res));
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

  // ====================> checkProyecto
  private checkProyecto(): void {
    this.visitaProyectoSvc
      .getOneVisitaProyecto(this.uuidVisita)
      .pipe(
        takeUntil(this.destroy$),
        catchError((httpError: HttpErrorResponse) => {
          if (
            httpError.error.message &&
            typeof httpError.error.message === 'string'
          ) {
            if (httpError.status === 404) {
              this.router.navigate(['/admin']);
            }
          }
          return throwError(httpError);
        })
      )
      .subscribe((visita: VisitaProyecto) => {
        this.urlBack = `/admin/proyecto/${visita.uuidProyecto}/visitas`;
      });
  }

  // ====================> backToVisitas
  public backToVisitas(): void {
    this.router.navigate([this.urlBack]);
  }

  // ====================> onLogout
  public onLogout(): void {
    this.authSvc.logout();
  }
}
