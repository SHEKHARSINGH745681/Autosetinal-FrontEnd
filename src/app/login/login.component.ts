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
  // OTP flow state
  showOtp = false;
  generatedOtp = '';
  otpInput = '';
  otpError = '';
  otpAttempts = 0;
  maxOtpAttempts = 3;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.isValidForm()) {
      this.isLoading = true;

      // Simulate API call for credentials
      setTimeout(() => {
        console.log('Login attempt:', this.loginData);

        // Simulate successful credential check - do NOT set final auth token yet
        const simulatedUser = {
          id: '123',
          name: 'John Doe',
          email: this.loginData.email
        };

        // Save provisional user data (won't be considered fully authenticated until OTP verified)
        localStorage.setItem('user_data_provisional', JSON.stringify(simulatedUser));

        // Simulate server-generated OTP (in real app you'd call backend to send OTP)
        this.generatedOtp = '0000'; // For demo; replace with secure generation
        console.log('Simulated OTP (for demo):', this.generatedOtp);

        this.isLoading = false;
        this.showOtp = true;
        
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

  verifyOtp(): void {
    this.otpError = '';
    if (!this.otpInput || this.otpInput.length === 0) {
      this.otpError = 'Please enter the OTP';
      return;
    }

    this.isLoading = true;
    // Simulate verification delay
    setTimeout(() => {
      this.isLoading = false;
      this.otpAttempts++;
      if (this.otpInput === this.generatedOtp) {
        // OTP correct: finalize login
        const provisional = localStorage.getItem('user_data_provisional');
        if (provisional) {
          localStorage.setItem('user_data', provisional);
        }
        const simulatedToken = 'fake-jwt-token-' + Date.now();
        localStorage.setItem('auth_token', simulatedToken);

        // Clean up provisional
        localStorage.removeItem('user_data_provisional');

        // Navigate to dashboard
        this.router.navigate(['/dashboard']);
      } else {
        if (this.otpAttempts >= this.maxOtpAttempts) {
          this.otpError = 'Maximum OTP attempts exceeded. Please login again.';
          // Reset flow
          this.resetOtpFlow();
        } else {
          this.otpError = 'Invalid OTP. Please try again.';
        }
      }
    }, 1000);
  }

  resendOtp(): void {
    // In real app call backend to resend. Here we just re-set the otp and inform user.
    this.generatedOtp = '0000';
    this.otpInput = '';
    this.otpError = '';
    this.otpAttempts = 0;
    console.log('Resent simulated OTP:', this.generatedOtp);
  }

  resetOtpFlow(): void {
    this.showOtp = false;
    this.generatedOtp = '';
    this.otpInput = '';
    this.otpAttempts = 0;
    this.isLoading = false;
    localStorage.removeItem('user_data_provisional');
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
