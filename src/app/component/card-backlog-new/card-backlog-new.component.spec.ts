import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBacklogNewComponent } from './card-backlog-new.component';

describe('CardBacklogNewComponent', () => {
  let component: CardBacklogNewComponent;
  let fixture: ComponentFixture<CardBacklogNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardBacklogNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardBacklogNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
