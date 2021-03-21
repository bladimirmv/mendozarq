import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipanteVisitaComponent } from './participante-visita.component';

describe('ParticipanteVisitaComponent', () => {
  let component: ParticipanteVisitaComponent;
  let fixture: ComponentFixture<ParticipanteVisitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipanteVisitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipanteVisitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
