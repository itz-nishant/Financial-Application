import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from 'src/app/models/category'; 

@Component({
  selector: 'app-category-transactions-dialog',
  templateUrl: './category-transactions-dialog.component.html',
  styleUrls: ['./category-transactions-dialog.component.css']
})
export class CategoryTransactionsDialogComponent implements OnInit {
  displayedColumns: string[] = ['date', 'description', 'amount'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { category: Category }) { }

  onClose(): void {
    localStorage.removeItem(`transactions_${this.data.category.name}`);
  }

  ngOnInit(): void {
  }

}
