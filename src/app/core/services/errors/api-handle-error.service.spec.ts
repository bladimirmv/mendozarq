import { TestBed } from '@angular/core/testing';

import { ApiHandleErrorService } from './api-handle-error.service';

describe('ApiHandleErrorService', () => {
  let service: ApiHandleErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiHandleErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
