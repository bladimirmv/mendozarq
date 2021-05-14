import { TestBed } from '@angular/core/testing';

import { CapituloPresupuestoService } from './capitulo-presupuesto.service';

describe('CapituloPresupuestoService', () => {
  let service: CapituloPresupuestoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CapituloPresupuestoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
