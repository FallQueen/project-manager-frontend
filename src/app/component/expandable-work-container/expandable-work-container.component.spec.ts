import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandableWorkContainerComponent } from './expandable-work-container.component';

describe('ExpandableWorkContainerComponent', () => {
  let component: ExpandableWorkContainerComponent;
  let fixture: ComponentFixture<ExpandableWorkContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpandableWorkContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpandableWorkContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
