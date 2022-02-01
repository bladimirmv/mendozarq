import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTareaPlanificacionComponent } from './new-tarea-planificacion.component';

describe('NewTareaPlanificacionComponent', () => {
  let component: NewTareaPlanificacionComponent;
  let fixture: ComponentFixture<NewTareaPlanificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTareaPlanificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTareaPlanificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
