import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  isLoading = false;
  showCompletion = false;

  @ViewChild('completionPlayer', { static: false }) completionPlayer?: ElementRef;
  
  // API Configuration - Replace with your hosted API URL
  private apiUrl = 'https://your-hosted-api.com'; // Replace with your actual hosted API URL
  private registerEndpoint = '/api/register'; // Replace with your actual register endpoint
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onSubmit() {
    if (this.signupData.password !== this.signupData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!this.isValidEmail(this.signupData.email)) {
      alert('Please enter a valid email address!');
      return;
    }

    if (this.signupData.password.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    this.createAccount();
  }

  private createAccount() {
    this.isLoading = true;
    
    // Prepare data for your hosted API
    const accountData = {
      name: this.signupData.fullName,        // Adjust field names based on your API
      email: this.signupData.email,
      password: this.signupData.password
      // Add any additional fields your hosted API requires
      // Example: firstName: this.signupData.fullName.split(' ')[0],
      // lastName: this.signupData.fullName.split(' ')[1] || ''
    };

    // Set HTTP headers for your hosted API
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // Add any required headers for your hosted API
      // 'Authorization': 'Bearer your-api-key',
      // 'X-API-Key': 'your-api-key'
    });

    console.log('Sending registration request to:', `${this.apiUrl}${this.registerEndpoint}`);
    console.log('Request payload:', accountData);

    // Make API call to your hosted API
    this.http.post(`${this.apiUrl}${this.registerEndpoint}`, accountData, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('Account created successfully:', response);
          
          // Handle successful response based on your API structure
          if (response.success || response.status === 'success' || response.message) {
            alert(response.message || 'Account created successfully! Please check your email for verification.');
            
            // Save token if your API returns one
            if (response.token || response.access_token) {
              localStorage.setItem('auth_token', response.token || response.access_token);
            }
            
            // Save user data if provided
            if (response.user || response.data) {
              localStorage.setItem('user_data', JSON.stringify(response.user || response.data));
            }
            
            // Show completion animation overlay, then redirect to login when it finishes
            this.showCompletion = true;
            // small timeout to ensure the player is rendered and available
            setTimeout(() => {
              try {
                const player = this.completionPlayer && (this.completionPlayer as any).nativeElement;
                if (player) {
                  // listen for the animationcomplete event (lottie-player web component)
                  const onComplete = () => {
                    player.removeEventListener('complete', onComplete);
                    this.showCompletion = false;
                    this.router.navigate(['/login']);
                  };
                  // Some lottie-player instances use 'complete' or 'animationcomplete'
                  player.addEventListener('complete', onComplete);
                  player.addEventListener('animationcomplete', onComplete);
                } else {
                  // fallback: redirect after 1.2s
                  setTimeout(() => this.router.navigate(['/login']), 1200);
                }
              } catch (e) {
                // fallback redirect
                setTimeout(() => this.router.navigate(['/login']), 1200);
              }
            }, 80);
          } else {
            alert('Registration completed, but there might be an issue. Please try logging in.');
          }
          
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error creating account:', error);
          console.error('Error details:', error.error);
          
          let errorMessage = 'Failed to create account. Please try again.';
          
          // Handle different error responses from your hosted API
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          // Handle specific HTTP status codes
          switch (error.status) {
            case 400:
              errorMessage = error.error?.message || 'Invalid input data. Please check your information.';
              break;
            case 401:
              errorMessage = 'Unauthorized. Please check your API credentials.';
              break;
            case 409:
            case 422:
              errorMessage = error.error?.message || 'Email already exists or validation error.';
              break;
            case 429:
              errorMessage = 'Too many requests. Please try again later.';
              break;
            case 500:
              errorMessage = 'Server error. Please try again later.';
              break;
            case 0:
              // Network error: offer demo/offline flow so local testing can continue
              const proceedOffline = confirm('Network error. No connection to the registration API. Do you want to continue in demo mode and complete signup locally?');
              if (proceedOffline) {
                // simulate success flow: play completion animation then redirect
                this.showCompletion = true;
                setTimeout(() => {
                  try {
                    const player = this.completionPlayer && (this.completionPlayer as any).nativeElement;
                    if (player) {
                      const onComplete = () => {
                        player.removeEventListener('complete', onComplete);
                        this.showCompletion = false;
                        this.router.navigate(['/login']);
                      };
                      player.addEventListener('complete', onComplete);
                      player.addEventListener('animationcomplete', onComplete);
                    } else {
                      setTimeout(() => this.router.navigate(['/login']), 1200);
                    }
                  } catch (e) {
                    setTimeout(() => this.router.navigate(['/login']), 1200);
                  }
                }, 80);
              } else {
                errorMessage = 'Network error. Please check your internet connection.';
              }
              break;
          }
          
          alert(errorMessage);
          this.isLoading = false;
        }
      });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
