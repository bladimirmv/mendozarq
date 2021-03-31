import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacionPersonalComponent } from './observacion-personal.component';

describe('ObservacionPersonalComponent', () => {
  let component: ObservacionPersonalComponent;
  let fixture: ComponentFixture<ObservacionPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservacionPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservacionPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
