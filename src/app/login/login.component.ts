import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };
  
  isLoading = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.isValidForm()) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        console.log('Login attempt:', this.loginData);
        
        // Simulate successful login - replace this with your actual API call
        const simulatedUser = {
          id: '123',
          name: 'John Doe',
          email: this.loginData.email
        };
        
        const simulatedToken = 'fake-jwt-token-' + Date.now();
        
        // Save user data and token to localStorage
        localStorage.setItem('user_data', JSON.stringify(simulatedUser));
        localStorage.setItem('auth_token', simulatedToken);
        
        this.isLoading = false;
        
        // Redirect to dashboard on successful login
        this.router.navigate(['/dashboard']);
        
        // Here you would typically call your authentication service
        // this.authService.login(this.loginData.email, this.loginData.password).subscribe({
        //   next: (response) => {
        //     if (response.success) {
        //       localStorage.setItem('auth_token', response.token);
        //       localStorage.setItem('user_data', JSON.stringify(response.user));
        //       this.router.navigate(['/dashboard']);
        //     }
        //   },
        //   error: (error) => {
        //     alert('Login failed. Please check your credentials.');
        //   }
        // });
        
      }, 2000);
    }
  }

  private isValidForm(): boolean {
    return this.loginData.email.length > 0 && 
           this.loginData.password.length >= 6 &&
           this.isValidEmail(this.loginData.email);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
