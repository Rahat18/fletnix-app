import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: any;

  ngOnInit() {
    this.getUserFromLocal();
  }

  getUserFromLocal() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      console.log('No user found in local storage');
    }
  }

  formatDate(dob: string): string {
    if (!dob) return 'N/A';
    
    const date = new Date(dob);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    
    const today = new Date();
    let age = today.getFullYear() - year;
    const monthDiff = today.getMonth() - date.getMonth();
    const dayDiff = today.getDate() - date.getDate();
    
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return `${day} ${month} ${year} (${age} Years)`;
  }
}
