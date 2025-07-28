import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogWorkDetailComponent } from './dialog-work-detail.component';

describe('DialogWorkDetailComponent', () => {
  let component: DialogWorkDetailComponent;
  let fixture: ComponentFixture<DialogWorkDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogWorkDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogWorkDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
