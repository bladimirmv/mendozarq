import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacionObraComponent } from './observacion-obra.component';

describe('ObservacionObraComponent', () => {
  let component: ObservacionObraComponent;
  let fixture: ComponentFixture<ObservacionObraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservacionObraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservacionObraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
