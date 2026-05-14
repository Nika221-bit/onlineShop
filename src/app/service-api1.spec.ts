import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { ServiceApi1 } from './service-api1';

describe('ServiceApi1', () => {
  let service: ServiceApi1;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(ServiceApi1);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
