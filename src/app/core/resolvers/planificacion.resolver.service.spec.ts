import { TestBed } from '@angular/core/testing';

import { Planificacion.ResolverService } from './planificacion.resolver.service';

describe('Planificacion.ResolverService', () => {
  let service: Planificacion.ResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Planificacion.ResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
