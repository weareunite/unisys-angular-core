import {TestBed} from '@angular/core/testing';

describe('CoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoreService = TestBed.get(CoreService);
    expect(service).toBeTruthy();
  });
});
