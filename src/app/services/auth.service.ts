import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authTokenKey = 'authToken';
  private readonly validUsername = 'nishantkr';
  private readonly validPassword = '123456';

  private generateToken(): string {
    return uuidv4();
  }

  constructor() { }

  login(username: string, password: string): boolean {
    if (username === this.validUsername && password === this.validPassword) {
      localStorage.setItem('authToken', this.generateToken());
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.authTokenKey);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.authTokenKey);
  }
}

