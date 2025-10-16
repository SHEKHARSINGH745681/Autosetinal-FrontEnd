import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userName: string = 'User';

  latitude = 28.6139; // New Delhi (example)
  longitude = 77.2090;

  orders = [
    {
      id: 371973,
      type: 'Food Delivery',
      status: 'In Transit',
      start: '3641 Edsel Road, Sherman Oaks, AC',
      end: '3085 Ripple Street, Sherman Oaks, AC'
    },
    {
      id: 748622,
      type: 'Bulk Cargo',
      status: 'Completed',
      start: '3641 Edsel Road, Sherman Oaks, AC',
      end: '3085 Ripple Street, Linwood, MI'
    }
  ];

  // selected order when a route/trip is held
  selectedOrder: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Get user data from localStorage if available
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.userName = user.name || user.fullName || 'User';
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Check if user is authenticated
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.router.navigate(['/login']);
  }

  selectOrder(order: any) {
    this.selectedOrder = order;
    // optionally update driver info or map position here
    // for demo, we'll set map coords to example values
    this.latitude = 28.6139;
    this.longitude = 77.2090;
  }
}
