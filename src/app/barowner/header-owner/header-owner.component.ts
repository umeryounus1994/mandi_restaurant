import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/providers/auth.service';

@Component({
  selector: 'header-owner',
  templateUrl: './header-owner.component.html',
  styleUrls: ['./header-owner.component.scss']
})
export class HeaderOwnerComponent implements OnInit {

  currentUrl: string;
  packageId="";

  constructor(public auth: AuthService, private router : Router, private route: ActivatedRoute) { 
    router.events.subscribe((_: NavigationEnd) => this.currentUrl = this.router.url);
  }

  ngOnInit() {
    this.packageId = JSON.parse(localStorage.getItem("package")).packageId;
  }

  navigateHomeOwner() {
    this.router.navigate(['/']);
  }

  navigateOwnerSettings() {
    this.router.navigate(["/einstellungen"]);
  }

  logout() {
    this.auth.clearLocalTokens();
    this.router.navigate(['/login']);
  }

}
