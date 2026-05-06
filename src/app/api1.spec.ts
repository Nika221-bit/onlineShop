import { TestBed } from '@angular/core/testing';

import { Api1 } from './api1';

describe('Api1', () => {
  let service: Api1;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Api1);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
