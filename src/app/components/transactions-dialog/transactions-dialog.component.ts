import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Category } from 'src/app/models/category';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-transaction-dialog',
  templateUrl: './transactions-dialog.component.html',
  styleUrls: ['./transactions-dialog.component.css']
})
export class TransactionsDialogComponent implements OnInit {
  transactionForm!: FormGroup;
  categories: Category[] = [];

  constructor(
    private dialogRef: MatDialogRef<TransactionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.transactionForm = this.fb.group({
      date: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      type: ['credit', Validators.required], // Default to 'credit' for new transactions
      amount: [null, [
        Validators.required,
        Validators.pattern(/^(-)?\d+(\.\d{1,2})?/),
        this.maxDigitsValidator(8)
      ]]
    });

    if (this.data.mode === 'edit') {
      const transaction = this.data.transaction;
      this.transactionForm.setValue({
        date: transaction.date,
        description: transaction.description,
        category: transaction.category,
        type: this.getTransactionType(transaction.amount),
        amount: Math.abs(transaction.amount)
      });
    }

    this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories;
      console.log('Fetched categories:', categories); // Debugging: Log the fetched categories
    });

    console.log('Transaction Form Initialized:', this.transactionForm.value); // Debugging: Log the initial form values
  }

  saveTransaction(): void {
    console.log('Entering saveTransaction'); // Debugging: Check if the function is entered

    if (this.transactionForm.valid) {
      console.log('Form is valid'); // Debugging: Check if the form is considered valid

      const transactionType = this.transactionForm.get('type')?.value;
      console.log('Transaction Type:', transactionType);

      const modifiedAmount = (transactionType === 'credit')
        ? Math.abs(this.transactionForm.get('amount')?.value)
        : -Math.abs(this.transactionForm.get('amount')?.value);

      console.log('Transaction Form Amount:', this.transactionForm.get('amount')?.value);
      console.log('Modified Amount:', modifiedAmount);

      const modifiedTransaction = {
        date: this.transactionForm.get('date')?.value,
        description: this.transactionForm.get('description')?.value,
        category: this.transactionForm.get('category')?.value,
        type: transactionType,
        amount: modifiedAmount
      };

      console.log('Modified Transaction:', modifiedTransaction);
      this.dialogRef.close(modifiedTransaction);
    } else {
      console.log('Form is not valid.');
    }

    console.log('Exiting saveTransaction');
  }

  close(): void {
    this.dialogRef.close();
  }

  maxDigitsValidator(maxDigits: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const amountValue = control.value;
      if (amountValue) {
        const amountString = amountValue.toString();
        if (amountString.replace('.', '').length > maxDigits) {
          return { maxDigits: true };
        }
      }
      return null;
    };
  }

  private getTransactionType(amount: number): string {
    return amount >= 0 ? 'credit' : 'debit';
  }
}
