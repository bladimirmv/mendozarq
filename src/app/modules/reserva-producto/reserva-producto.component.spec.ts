import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaProductoComponent } from './reserva-producto.component';

describe('ReservaProductoComponent', () => {
  let component: ReservaProductoComponent;
  let fixture: ComponentFixture<ReservaProductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservaProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservaProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
