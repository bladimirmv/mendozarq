import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewObservacionObraComponent } from './new-observacion-obra.component';

describe('NewObservacionObraComponent', () => {
  let component: NewObservacionObraComponent;
  let fixture: ComponentFixture<NewObservacionObraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewObservacionObraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewObservacionObraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
