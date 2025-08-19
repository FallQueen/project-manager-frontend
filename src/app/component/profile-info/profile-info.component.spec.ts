import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {  ProfileInfoComponent } from './profile-info.component';

describe('ProfileInfoComponent', () => {
  let component:  ProfileInfoComponent;
  let fixture: ComponentFixture< ProfileInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileInfoComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { name: 'Test User', email: 'test@example.com' } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent( ProfileInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
