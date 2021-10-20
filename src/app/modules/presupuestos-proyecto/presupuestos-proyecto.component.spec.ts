import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresupuestosProyectoComponent } from './presupuestos-proyecto.component';

describe('PresupuestosProyectoComponent', () => {
  let component: PresupuestosProyectoComponent;
  let fixture: ComponentFixture<PresupuestosProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresupuestosProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresupuestosProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
