import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogWorkContainerComponent } from './dialog-work-container.component';

describe('DialogWorkContainerComponent', () => {
  let component: DialogWorkContainerComponent;
  let fixture: ComponentFixture<DialogWorkContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogWorkContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogWorkContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
