import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/providers/auth.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  barName = "";
  
  constructor(private route: ActivatedRoute, private auth: AuthService, private router: Router) { 
    if(this.auth.accountStatusDisable) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
  }

  navigateShishaCard() {
    this.router.navigate(['/bar/karten/breakfast']);
  }

  navigateDrinksCard() {
    this.router.navigate(['/bar/karten/lunch']);
  }

  navigateFoodsCard() {
    this.router.navigate(['/bar/karten/speisen']);
  }

}
