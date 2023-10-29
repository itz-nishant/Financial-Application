import { Component, OnInit } from '@angular/core';
import { TransactionsService } from 'src/app/services/transactions.service';
import { DataItem } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  balance: number = 0;
  totalIncome: number = 0;
  totalExpenses: number = 0;

  chartData: DataItem[] = [];
  pieChartData: any[] = [];
  colorScheme: any;

  selectedChartType: string = 'bar';
  constructor(private transactionsService: TransactionsService) { }

  ngOnInit(): void {
    this.colorScheme = {
      domain: ['#5AA454', '#E44D25'],
    };

    this.selectedChartType = localStorage.getItem('selectedChartType') || 'bar';

    const localTransactions = localStorage.getItem('transactions');
    if (localTransactions) {
      const transactions = JSON.parse(localTransactions);
      this.processTransactions(transactions);
    } else {
      this.transactionsService.getTransactions().subscribe((transactions) => {
        this.processTransactions(transactions);
      });
    }
  }

  changeChartType(): void {
    localStorage.setItem('selectedChartType', this.selectedChartType);
  }

  private processTransactions(transactions: any[]): void {
    this.balance = transactions.reduce((total, transaction) => total + transaction.amount, 0);
    this.totalIncome = transactions
      .filter((transaction) => transaction.amount > 0)
      .reduce((total, transaction) => total + transaction.amount, 0);
    this.totalExpenses = transactions
      .filter((transaction) => transaction.amount < 0)
      .reduce((total, transaction) => total + transaction.amount, 0);

    this.chartData = [
      { name: 'Income', value: this.totalIncome },
      { name: 'Expenses', value: Math.abs(this.totalExpenses) },
    ];

    this.pieChartData = [
      { name: 'Income', value: this.totalIncome },
      { name: 'Expenses', value: Math.abs(this.totalExpenses) },
    ];
  }
}


