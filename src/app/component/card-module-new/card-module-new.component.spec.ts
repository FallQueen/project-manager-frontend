import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardModuleNewComponent } from './card-module-new.component';

describe('CardModuleNewComponent', () => {
  let component: CardModuleNewComponent;
  let fixture: ComponentFixture<CardModuleNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardModuleNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardModuleNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
