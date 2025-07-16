import { TestBed } from '@angular/core/testing';

import { ProjectPageService } from './project-page.service';

describe('ProjectPageService', () => {
  let service: ProjectPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
