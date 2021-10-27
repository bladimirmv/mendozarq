import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFotoProductoComponent } from './edit-foto-producto.component';

describe('EditFotoProductoComponent', () => {
  let component: EditFotoProductoComponent;
  let fixture: ComponentFixture<EditFotoProductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFotoProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFotoProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
