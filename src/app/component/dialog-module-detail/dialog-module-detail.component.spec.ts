import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogModuleDetailComponent } from './dialog-module-detail.component';

describe('DialogModuleDetailComponent', () => {
  let component: DialogModuleDetailComponent;
  let fixture: ComponentFixture<DialogModuleDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogModuleDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogModuleDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
