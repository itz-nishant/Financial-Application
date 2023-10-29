import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { TransactionsService } from 'src/app/services/transactions.service';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private transactionsService: TransactionsService,
    private categoriesService: CategoriesService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      if (this.authService.login(username, password)) {
        this.transactionsService.getTransactions().subscribe(transactions => {
          localStorage.setItem('transactions', JSON.stringify(transactions));
        });

        this.categoriesService.getCategories().subscribe(categories => {
          localStorage.setItem('categories', JSON.stringify(categories));
        });

        this.router.navigate(['/dashboard']);


        this.snackBar.open('Logged in successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      } else {
        this.loginError = true;
      }
    }
  }
}
