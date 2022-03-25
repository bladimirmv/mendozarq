import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVentaComponent } from './new-venta.component';

describe('NewVentaComponent', () => {
  let component: NewVentaComponent;
  let fixture: ComponentFixture<NewVentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewVentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
