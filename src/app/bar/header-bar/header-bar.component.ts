import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/providers/auth.service';

@Component({
  selector: 'header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit {

  currentUrl: string;
  packageId="";
  userType;

  constructor(public auth: AuthService, private router : Router, private route: ActivatedRoute) { 
    router.events.subscribe((_: NavigationEnd) => this.currentUrl = this.router.url);
    this.userType = JSON.parse(localStorage.getItem("data")).accountType;
  }

  ngOnInit() {
  }

  navigateHomeOwner() {
    this.router.navigate(['/']);
  }

  navigateOrders() {
    this.router.navigate(['/bar']);
  }

  navigateStatistics() {
    this.router.navigate(['/bar/statistiken']);
  }

  navigateBarSettings() {
    this.router.navigate(['/bar/einstellungen']);
  }

  navigateCards() {
    this.router.navigate(['/bar/karten']);
  }

  logout() {
    this.auth.clearLocalTokens();
    this.router.navigate(['/login']);
  }

}
