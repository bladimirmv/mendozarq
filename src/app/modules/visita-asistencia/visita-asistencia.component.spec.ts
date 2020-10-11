import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitaAsistenciaComponent } from './visita-asistencia.component';

describe('VisitaAsistenciaComponent', () => {
  let component: VisitaAsistenciaComponent;
  let fixture: ComponentFixture<VisitaAsistenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitaAsistenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitaAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
