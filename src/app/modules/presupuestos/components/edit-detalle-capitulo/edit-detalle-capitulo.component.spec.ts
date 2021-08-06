import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDetalleCapituloComponent } from './edit-detalle-capitulo.component';

describe('EditDetalleCapituloComponent', () => {
  let component: EditDetalleCapituloComponent;
  let fixture: ComponentFixture<EditDetalleCapituloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDetalleCapituloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDetalleCapituloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
