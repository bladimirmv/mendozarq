import { TestBed } from '@angular/core/testing';

import { LocationBarService } from './location-bar.service';

describe('LocationBarService', () => {
  let service: LocationBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
