import { TestBed } from '@angular/core/testing';

import { DetalleCapituloService } from './detalle-capitulo.service';

describe('DetalleCapituloService', () => {
  let service: DetalleCapituloService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalleCapituloService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
