import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDetalleCapituloComponent } from './new-detalle-capitulo.component';

describe('NewDetalleCapituloComponent', () => {
  let component: NewDetalleCapituloComponent;
  let fixture: ComponentFixture<NewDetalleCapituloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDetalleCapituloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDetalleCapituloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
