import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementTransactionListComponent } from './product-list.component';

describe('StatementTransactionListComponent', () => {
  let component: StatementTransactionListComponent;
  let fixture: ComponentFixture<StatementTransactionListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatementTransactionListComponent]
    });
    fixture = TestBed.createComponent(StatementTransactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
