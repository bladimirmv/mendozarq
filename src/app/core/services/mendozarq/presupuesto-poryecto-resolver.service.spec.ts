import { TestBed } from '@angular/core/testing';

import { PresupuestoPoryectoResolverService } from './presupuesto-poryecto-resolver.service';

describe('PresupuestoPoryectoResolverService', () => {
  let service: PresupuestoPoryectoResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PresupuestoPoryectoResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
