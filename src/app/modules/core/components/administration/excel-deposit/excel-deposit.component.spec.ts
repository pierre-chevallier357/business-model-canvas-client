import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelDepositComponent } from './excel-deposit.component';

describe('ExcelDepositComponent', () => {
  let component: ExcelDepositComponent;
  let fixture: ComponentFixture<ExcelDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcelDepositComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcelDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
