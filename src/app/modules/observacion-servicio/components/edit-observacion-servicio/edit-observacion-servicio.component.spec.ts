import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditObservacionServicioComponent } from './edit-observacion-servicio.component';

describe('EditObservacionServicioComponent', () => {
  let component: EditObservacionServicioComponent;
  let fixture: ComponentFixture<EditObservacionServicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditObservacionServicioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditObservacionServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
