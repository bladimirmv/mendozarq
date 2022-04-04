import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditObservacionObraComponent } from './edit-observacion-obra.component';

describe('EditObservacionObraComponent', () => {
  let component: EditObservacionObraComponent;
  let fixture: ComponentFixture<EditObservacionObraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditObservacionObraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditObservacionObraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
