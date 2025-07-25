import { TestBed } from '@angular/core/testing';

import { BacklogPageService } from './backlog-page.service';

describe('BacklogPageService', () => {
  let service: BacklogPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BacklogPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
