import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardWorkNewComponent } from './card-work-new.component';

describe('CardWorkNewComponent', () => {
  let component: CardWorkNewComponent;
  let fixture: ComponentFixture<CardWorkNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardWorkNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardWorkNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
