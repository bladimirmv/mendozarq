import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditObservacionPersonalComponent } from './edit-observacion-personal.component';

describe('EditObservacionPersonalComponent', () => {
  let component: EditObservacionPersonalComponent;
  let fixture: ComponentFixture<EditObservacionPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditObservacionPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditObservacionPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
