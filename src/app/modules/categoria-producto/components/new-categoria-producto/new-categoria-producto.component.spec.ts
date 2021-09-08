import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCategoriaProductoComponent } from './new-categoria-producto.component';

describe('NewCategoriaProductoComponent', () => {
  let component: NewCategoriaProductoComponent;
  let fixture: ComponentFixture<NewCategoriaProductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCategoriaProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCategoriaProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
