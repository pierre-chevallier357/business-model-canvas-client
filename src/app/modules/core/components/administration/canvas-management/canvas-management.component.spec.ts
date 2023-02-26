import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasManagementComponent } from './canvas-management.component';

describe('IndividualCanvasManagementComponent', () => {
  let component: CanvasManagementComponent;
  let fixture: ComponentFixture<CanvasManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CanvasManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CanvasManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
