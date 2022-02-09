import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTareaPlanificacionComponent } from './edit-tarea-planificacion.component';

describe('EditTareaPlanificacionComponent', () => {
  let component: EditTareaPlanificacionComponent;
  let fixture: ComponentFixture<EditTareaPlanificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTareaPlanificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTareaPlanificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
