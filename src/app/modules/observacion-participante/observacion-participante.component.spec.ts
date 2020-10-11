import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacionParticipanteComponent } from './observacion-participante.component';

describe('ObservacionParticipanteComponent', () => {
  let component: ObservacionParticipanteComponent;
  let fixture: ComponentFixture<ObservacionParticipanteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservacionParticipanteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservacionParticipanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
