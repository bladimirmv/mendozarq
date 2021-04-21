import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPresupuestoComponent } from './edit-presupuesto.component';

describe('EditPresupuestoComponent', () => {
  let component: EditPresupuestoComponent;
  let fixture: ComponentFixture<EditPresupuestoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPresupuestoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPresupuestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
