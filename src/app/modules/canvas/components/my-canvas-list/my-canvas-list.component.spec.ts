import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCanvasListComponent } from './my-canvas-list.component';

describe('MyCanvasListComponent', () => {
  let component: MyCanvasListComponent;
  let fixture: ComponentFixture<MyCanvasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyCanvasListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyCanvasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
