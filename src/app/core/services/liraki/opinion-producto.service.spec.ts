import { TestBed } from '@angular/core/testing';

import { OpinionProductoService } from './opinion-producto.service';

describe('OpinionProductoService', () => {
  let service: OpinionProductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpinionProductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
