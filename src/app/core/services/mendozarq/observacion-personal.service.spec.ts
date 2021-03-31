import { TestBed } from '@angular/core/testing';

import { ObservacionPersonalService } from './observacion-personal.service';

describe('ObservacionPersonalService', () => {
  let service: ObservacionPersonalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObservacionPersonalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
