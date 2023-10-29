import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`);
  }

  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/transactions`, transaction);
  }

  updateTransaction(transactionId: number, updatedTransaction: Transaction): Observable<Transaction> {
    const apiUrl = `${this.apiUrl}/transactions/${transactionId}`;
    return this.http.put<Transaction>(apiUrl, updatedTransaction);
  }

  deleteTransaction(transactionId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/transactions/${transactionId}`);
  }
}
