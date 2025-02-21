import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {

  constructor(private router: Router) { }

  registrationFn(type: string) {
    console.log('type', type)
    if (type == 'register') {
      sessionStorage.setItem('user_type', 'true')
    } else if (type == 'login') {
      sessionStorage.setItem('user_type', 'false')
    }
    this.router.navigate(['/registration']);
  }
  gotoHome(){
    this.router.navigate(['/']);
  }
}
