import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugPageComponent } from './bug-page.component';

describe('BugPageComponent', () => {
  let component: BugPageComponent;
  let fixture: ComponentFixture<BugPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BugPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BugPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
