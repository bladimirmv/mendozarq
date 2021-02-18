import { TestBed } from '@angular/core/testing';

import { ParticipantesProyectoService } from './participantes-proyecto.service';

describe('ParticipantesProyectoService', () => {
  let service: ParticipantesProyectoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipantesProyectoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
