import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresupuestoProyectoComponent } from './presupuesto-proyecto.component';

describe('PresupuestoProyectoComponent', () => {
  let component: PresupuestoProyectoComponent;
  let fixture: ComponentFixture<PresupuestoProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresupuestoProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresupuestoProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
