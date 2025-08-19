import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PopUpProfileComponent } from './pop-up-profile.component';

describe('PopUpProfileComponent', () => {
  let component: PopUpProfileComponent;
  let fixture: ComponentFixture<PopUpProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopUpProfileComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { name: 'Test User', email: 'test@example.com' } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PopUpProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
