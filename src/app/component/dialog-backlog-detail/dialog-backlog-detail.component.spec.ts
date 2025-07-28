import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBacklogDetailComponent } from './dialog-backlog-detail.component';

describe('DialogBacklogDetailComponent', () => {
  let component: DialogBacklogDetailComponent;
  let fixture: ComponentFixture<DialogBacklogDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogBacklogDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogBacklogDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
