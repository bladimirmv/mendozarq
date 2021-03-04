import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewObservacionServicioComponent } from './new-observacion-servicio.component';

describe('NewObservacionServicioComponent', () => {
  let component: NewObservacionServicioComponent;
  let fixture: ComponentFixture<NewObservacionServicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewObservacionServicioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewObservacionServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
