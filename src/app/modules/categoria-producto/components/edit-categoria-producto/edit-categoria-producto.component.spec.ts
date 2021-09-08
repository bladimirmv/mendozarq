import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCategoriaProductoComponent } from './edit-categoria-producto.component';

describe('EditCategoriaProductoComponent', () => {
  let component: EditCategoriaProductoComponent;
  let fixture: ComponentFixture<EditCategoriaProductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCategoriaProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCategoriaProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
