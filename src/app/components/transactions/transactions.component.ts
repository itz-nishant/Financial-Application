import { Component, OnInit } from '@angular/core';
import { TransactionsService } from 'src/app/services/transactions.service';
import { MatDialog } from '@angular/material/dialog';
import { TransactionsDialogComponent } from '../transactions-dialog/transactions-dialog.component';
import { Transaction } from 'src/app/models/transaction';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];

  constructor(private transactionsService: TransactionsService, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      this.transactions = JSON.parse(storedTransactions);
    } else {
      this.fetchTransactionsFromServer();
    }
  }

  fetchTransactionsFromServer(): void {
    this.transactionsService.getTransactions().subscribe(transactions => {
      this.transactions = transactions;
      localStorage.setItem('transactions', JSON.stringify(transactions));
    });
  }

  openAddTransactionDialog(): void {
    const dialogRef = this.dialog.open(TransactionsDialogComponent, {
      width: '400px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newTransaction: Transaction = result;

        this.transactions.push(newTransaction);
        localStorage.setItem('transactions', JSON.stringify(this.transactions));

        this.transactionsService.addTransaction(newTransaction).subscribe(response => {
          this.fetchTransactionsFromServer();
          this.openSuccessSnackBar('Transaction added successfully');
        });
      }
    });
  }

  openEditTransactionDialog(index: number): void {
    const dialogRef = this.dialog.open(TransactionsDialogComponent, {
      width: '400px',
      data: { mode: 'edit', transaction: { ...this.transactions[index] } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const editedTransaction = { ...result, id: this.transactions[index].id };

        this.transactions[index] = editedTransaction;
        localStorage.setItem('transactions', JSON.stringify(this.transactions));

        this.transactionsService.updateTransaction(editedTransaction.id, editedTransaction).subscribe(updatedTransaction => {
          this.fetchTransactionsFromServer();
          this.openSuccessSnackBar('Transaction updated successfully');
        });
      }
    });
  }

  deleteTransaction(index: number): void {
    const transactionId = this.transactions[index].id;
    this.transactionsService.deleteTransaction(transactionId).subscribe(() => {
      this.transactions.splice(index, 1);
      localStorage.setItem('transactions', JSON.stringify(this.transactions));
      this.openSuccessSnackBar('Transaction deleted successfully');
    });
  }

  openSuccessSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}
