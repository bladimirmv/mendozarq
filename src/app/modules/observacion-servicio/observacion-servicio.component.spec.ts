import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacionServicioComponent } from './observacion-servicio.component';

describe('ObservacionServicioComponent', () => {
  let component: ObservacionServicioComponent;
  let fixture: ComponentFixture<ObservacionServicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservacionServicioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservacionServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
