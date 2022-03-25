import { TestBed } from '@angular/core/testing';

import { UsuarioResolverService } from './usuario-resolver.service';

describe('UsuarioResolverService', () => {
  let service: UsuarioResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
