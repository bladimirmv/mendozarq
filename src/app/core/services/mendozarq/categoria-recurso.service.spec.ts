import { TestBed } from '@angular/core/testing';

import { CategoriaRecursoService } from './categoria-recurso.service';

describe('CategoriaRecursoService', () => {
  let service: CategoriaRecursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriaRecursoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
