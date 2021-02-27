import { TestBed } from '@angular/core/testing';

import { VisitaProyectoService } from './visita-proyecto.service';

describe('VisitaProyectoService', () => {
  let service: VisitaProyectoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisitaProyectoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
