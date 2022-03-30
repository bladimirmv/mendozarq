import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasOnlineComponent } from './ventas-online.component';

describe('VentasOnlineComponent', () => {
  let component: VentasOnlineComponent;
  let fixture: ComponentFixture<VentasOnlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasOnlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
