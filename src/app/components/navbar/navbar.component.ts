import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  showLogoutButton = false;
  isMobile: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.breakpointObserver.observe([
      Breakpoints.HandsetPortrait,
      Breakpoints.TabletPortrait,
    ]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  toggleLogoutButton() {
    this.showLogoutButton = !this.showLogoutButton;
  }

  logout() {
    localStorage.clear();
    this.authService.logout();
    this.router.navigate(['']);

    this.snackBar.open('Logged out successfully', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });

    this.showLogoutButton = false;
  }
}
