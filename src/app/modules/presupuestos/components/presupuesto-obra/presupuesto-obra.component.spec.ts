import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresupuestoObraComponent } from './presupuesto-obra.component';

describe('PresupuestoObraComponent', () => {
  let component: PresupuestoObraComponent;
  let fixture: ComponentFixture<PresupuestoObraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresupuestoObraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresupuestoObraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
