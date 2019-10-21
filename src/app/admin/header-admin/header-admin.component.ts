import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/providers/auth.service';

@Component({
  selector: 'header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.scss']
})
export class HeaderAdminComponent implements OnInit {

  currentUrl: string;

  constructor(public auth: AuthService, private router : Router, private route: ActivatedRoute) { 
    router.events.subscribe((_: NavigationEnd) => this.currentUrl = this.router.url);
  }

  ngOnInit() {
  }

  navigateHomeAdmin() {
    this.router.navigate(['/admin']);
  }

  navigateBarowners() {
    this.router.navigate(['/admin']);
  }

  navigateBars() {
    this.router.navigate(["/admin/bars"]);
  }

  navigateUsers() {
    this.router.navigate(["/admin/users"]);
  }

  logout() {
    this.auth.clearLocalTokens();
    this.router.navigate(['/login']);
  }


  

}
