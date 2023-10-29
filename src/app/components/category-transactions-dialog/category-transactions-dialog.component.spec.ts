import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTransactionsDialogComponent } from './category-transactions-dialog.component';

describe('CategoryTransactionsDialogComponent', () => {
  let component: CategoryTransactionsDialogComponent;
  let fixture: ComponentFixture<CategoryTransactionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryTransactionsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryTransactionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
