import { ActivatedRoute } from '@angular/router';
import { LocationBarService } from '../../core/services/mendozarq/location-bar.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { BrightnessService } from './../../core/services/brightness.service';
import { Location } from '@angular/common';
import { map, shareReplay, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { AppearanceComponent } from '@app/shared/components/appearance/appearance.component';
import { Usuario } from '@app/shared/models/usuario.interface';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
  public modeSidenav = 'side';
  public breakpoint: boolean;
  private destroy$: Subject<any> = new Subject<any>();
  public current_usuario: Usuario = [] as Usuario;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private location: Location,
    public brightnessSvc: BrightnessService,
    public authSvc: AuthService,
    public locationBarSvc: LocationBarService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.brightnessSvc.theme$.pipe(take(1)).subscribe((res: boolean) => {
      this.brightnessSvc.toggleTheme(res);
    });
  }

  ngOnInit(): void {
    this.current_usuario = this.route.snapshot.data['usuario'];

    this.breakpointObserver
      .observe('(max-width: 700px)')
      .pipe(
        takeUntil(this.destroy$),
        map((res) => res.matches),
        shareReplay()
      )
      .subscribe((res) => (this.breakpoint = res));

    // this.authSvc.usuario$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((usuario: Usuario) => {
    //     this.current_usuario = usuario;
    //   });
  }
  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
    // this.locationBarSvc.deleteLocation();
  }
  public onback(): void {
    this.location.back();
  }
  public onForward(): void {
    this.location.forward();
  }

  public onLogout(): void {
    this.authSvc.logout();
  }

  public settings(): void {
    this.dialog.open(AppearanceComponent, {
      panelClass: 'custom-bg-dialog-container',
    });
  }
}
