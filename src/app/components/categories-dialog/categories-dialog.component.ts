import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-categories-dialog',
  templateUrl: './categories-dialog.component.html',
  styleUrls: ['./categories-dialog.component.css']
})
export class CategoriesDialogComponent implements OnInit {
  categoryForm!: FormGroup;
  categories: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<CategoriesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: [this.data.mode === 'edit' ? this.data.category.name : '', Validators.required]
    });

    this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories.map(category => category.name.toLowerCase());
    });
  }

  save(): void {
    if (this.categoryForm.valid) {
      const categoryName = this.categoryForm.value.name.toLowerCase();

      if (this.categories.includes(categoryName)) {
        this.categoryForm.get('name')?.setErrors({ categoryExists: true });
        return;
      }

      this.dialogRef.close(this.categoryForm.value);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
