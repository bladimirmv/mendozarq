import { TestBed } from '@angular/core/testing';

import { ParticipanteVisitaService } from './participante-visita.service';

describe('ParticipanteVisitaService', () => {
  let service: ParticipanteVisitaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipanteVisitaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
