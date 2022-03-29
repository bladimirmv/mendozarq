import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpinionProductoComponent } from './opinion-producto.component';

describe('OpinionProductoComponent', () => {
  let component: OpinionProductoComponent;
  let fixture: ComponentFixture<OpinionProductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpinionProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpinionProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
