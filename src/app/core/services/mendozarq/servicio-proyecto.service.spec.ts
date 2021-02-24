import { TestBed } from '@angular/core/testing';

import { ServicioProyectoService } from './servicio-proyecto.service';

describe('ServicioProyectoService', () => {
  let service: ServicioProyectoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioProyectoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
