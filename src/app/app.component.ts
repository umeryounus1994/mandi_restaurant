import { Component } from '@angular/core';
import { AuthService } from './providers/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  title = 'dashboard';
  currentUrl: string;
  LoggedIn = false;

  constructor(private router: Router,private auth : AuthService, location : Location, private translate: TranslateService) {
    router.events.subscribe((_: NavigationEnd) => this.currentUrl = this.router.url);
    this.initTranslate();
    
    this.currentUrl =location.path();

    if(auth.getLocalTokens() == 'undefined' || auth.getLocalTokens() == null){
      this.LoggedIn = false;
      this.router.navigate(['/login']);
    } else {
      var type = JSON.parse(localStorage.getItem('data')).accountType;
      this.LoggedIn = true;
      this.router.navigate(['/'+this.currentUrl]);
    }
  }

  private initTranslate(){
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');

    // if (this.translate.getBrowserLang() !== undefined) {
    //   this.translate.use(this.translate.getBrowserLang());
    // }
    // else {
    //   this.translate.use('en'); // Set your language here
    // }
  }
}
