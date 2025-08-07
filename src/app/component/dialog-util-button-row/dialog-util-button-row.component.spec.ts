import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUtilButtonRowComponent } from './dialog-util-button-row.component';

describe('DialogUtilButtonRowComponent', () => {
  let component: DialogUtilButtonRowComponent;
  let fixture: ComponentFixture<DialogUtilButtonRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogUtilButtonRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogUtilButtonRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
