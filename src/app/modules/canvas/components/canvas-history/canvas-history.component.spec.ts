import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasHistoryComponent } from './canvas-history.component';

describe('CanvasHistoricComponent', () => {
  let component: CanvasHistoryComponent;
  let fixture: ComponentFixture<CanvasHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CanvasHistoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CanvasHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
