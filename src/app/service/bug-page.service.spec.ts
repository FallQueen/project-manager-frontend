import { TestBed } from '@angular/core/testing';

import { BugPageService } from './bug-page.service';

describe('BugPageService', () => {
  let service: BugPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BugPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
