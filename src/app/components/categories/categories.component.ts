import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/services/categories.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesDialogComponent } from '../categories-dialog/categories-dialog.component';
import { CategoryTransactionsDialogComponent } from '../category-transactions-dialog/category-transactions-dialog.component';
import { Category } from 'src/app/models/category';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];

  constructor(private categoriesService: CategoriesService, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      this.categories = JSON.parse(storedCategories);
    } else {
      this.categoriesService.getCategories().subscribe(categories => {
        this.categories = categories;
        localStorage.setItem('categories', JSON.stringify(categories));
      });
    }
  }

  openAddCategoryDialog(): void {
    const dialogRef = this.dialog.open(CategoriesDialogComponent, {
      width: '400px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoriesService.addCategory(result).subscribe(newCategory => {
          this.categories.push(newCategory);
          localStorage.setItem('categories', JSON.stringify(this.categories));
          this.openSuccessSnackBar('Category Added successfully');
        });
      }
    });
  }

  openEditCategoryDialog(index: number): void {
    const dialogRef = this.dialog.open(CategoriesDialogComponent, {
      width: '400px',
      data: { mode: 'edit', category: this.categories[index] }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const editedCategory = { ...result, id: this.categories[index].id };

        this.categories[index] = editedCategory;
        localStorage.setItem('categories', JSON.stringify(this.categories));
        this.openSuccessSnackBar('Category updated successfully');

        this.categoriesService.updateCategory(editedCategory.id, editedCategory).subscribe(() => {
        });
      }
    });
  }

  deleteCategory(index: number): void {
    const categoryId = this.categories[index].id;
    this.categoriesService.deleteCategory(categoryId).subscribe(() => {
      this.categories.splice(index, 1);
      localStorage.setItem('categories', JSON.stringify(this.categories));
      this.openSuccessSnackBar('Category deleted successfully');
    });
  }

  viewCategoryTransactions(category: Category): void {
    this.categoriesService.getCategoryTransactions(category.name).subscribe(transactions => {
      category.transactions = transactions;
      localStorage.setItem(`transactions_${category.name}`, JSON.stringify(transactions));
    });

    const dialogRef = this.dialog.open(CategoryTransactionsDialogComponent, {
      width: '700px',
      data: { category }
    });
  }
  openSuccessSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}
