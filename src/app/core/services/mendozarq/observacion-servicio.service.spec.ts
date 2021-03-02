import { TestBed } from '@angular/core/testing';

import { ObservacionServicioService } from './observacion-servicio.service';

describe('ObservacionServicioService', () => {
  let service: ObservacionServicioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObservacionServicioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
