import { TestBed } from '@angular/core/testing';

import { ObservacionObraService } from './observacion-obra.service';

describe('ObservacionObraService', () => {
  let service: ObservacionObraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObservacionObraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
