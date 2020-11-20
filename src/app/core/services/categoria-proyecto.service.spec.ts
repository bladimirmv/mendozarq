import { TestBed } from '@angular/core/testing';

import { CategoriaProyectoService } from './categoria-proyecto.service';

describe('CategoriaProyectoService', () => {
  let service: CategoriaProyectoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriaProyectoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
