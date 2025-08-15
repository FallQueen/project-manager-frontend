import { TestBed } from '@angular/core/testing';

import { GanttPageService } from './gantt-page.service';

describe('GanttPageService', () => {
  let service: GanttPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GanttPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
