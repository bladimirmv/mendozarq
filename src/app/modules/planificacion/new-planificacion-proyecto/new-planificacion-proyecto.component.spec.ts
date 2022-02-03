import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPlanificacionProyectoComponent } from './new-planificacion-proyecto.component';

describe('NewPlanificacionProyectoComponent', () => {
  let component: NewPlanificacionProyectoComponent;
  let fixture: ComponentFixture<NewPlanificacionProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPlanificacionProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPlanificacionProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
