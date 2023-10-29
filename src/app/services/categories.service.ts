import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  getCategoryTransactions(categoryName: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions?category=${categoryName}`);
  }

  addCategory(category: Category): Observable<any> {
    return this.http.post(`${this.apiUrl}/categories`, category);
  }

  updateCategory(categoryId: number, updatedCategory: Category): Observable<any> {
    return this.http.put(`${this.apiUrl}/categories/${categoryId}`, updatedCategory);
  }

  deleteCategory(categoryId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categories/${categoryId}`);
  }
}
