import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlanificacionProyectoComponent } from './edit-planificacion-proyecto.component';

describe('EditPlanificacionProyectoComponent', () => {
  let component: EditPlanificacionProyectoComponent;
  let fixture: ComponentFixture<EditPlanificacionProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPlanificacionProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPlanificacionProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
