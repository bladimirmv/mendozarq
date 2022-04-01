import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPresupuestoProyectoComponent } from './new-presupuesto-proyecto.component';

describe('NewPresupuestoProyectoComponent', () => {
  let component: NewPresupuestoProyectoComponent;
  let fixture: ComponentFixture<NewPresupuestoProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPresupuestoProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPresupuestoProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
