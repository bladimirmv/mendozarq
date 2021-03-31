import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewObservacionPersonalComponent } from './new-observacion-personal.component';

describe('NewObservacionPersonalComponent', () => {
  let component: NewObservacionPersonalComponent;
  let fixture: ComponentFixture<NewObservacionPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewObservacionPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewObservacionPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
