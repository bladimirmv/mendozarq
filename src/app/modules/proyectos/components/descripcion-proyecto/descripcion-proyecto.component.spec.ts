import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescripcionProyectoComponent } from './descripcion-proyecto.component';

describe('DescripcionProyectoComponent', () => {
  let component: DescripcionProyectoComponent;
  let fixture: ComponentFixture<DescripcionProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescripcionProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescripcionProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
