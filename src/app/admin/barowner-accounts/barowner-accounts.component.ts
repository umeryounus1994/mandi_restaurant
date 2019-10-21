import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/providers/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-barowner-accounts',
  templateUrl: './barowner-accounts.component.html',
  styleUrls: ['./barowner-accounts.component.scss']
})
export class BarownerAccountsComponent implements OnInit {

  userBars=[];
  barsCount=0;
  allbars = [];
  other =[];
  email ;
  constructor(private auth : AuthService, private router : Router, private api: ApiService, private spinner: NgxSpinnerService) {
    var type = JSON.parse(localStorage.getItem('data')).accountType;
    if(type == "barowner") {
        this.router.navigate(['/']);
      }
      if(type == "admin") {
        this.router.navigate(['/admin']);
      }
    
   }

  ngOnInit() {
    this.spinner.show();
    this.api.getAllUsers().pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      this.spinner.hide();
      this.userBars = data;
      this.allbars = this.userBars;
      this.barsCount = this.userBars.length;
    
    })
  }
  SearchPackageWise(value : string) {
    if(value != "") {
      this.i =0;
      this.barsCount=0;
      this.other = [];
      this.userBars = [];
      this.spinner.show();
    this.api.getSearchPackages(value).pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      
      this.spinner.hide();
      data.map(item => {
        return {
          userId: item.userId,
          email: this.getEmail(item.userId),
        };
    }).forEach(item => this.other.push(item));
    })
  } else {
    this.userBars = [];
    this.barsCount = this.allbars.length;
    this.userBars = this.allbars;
  }
    
  }
  user;

  i=0;

   getEmail(userId)  {

    this.api.getUser1(userId).pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {

      if(data.length > 0) {
        this.barsCount = this.barsCount +1;
        var d = {
          email : data[0].email,
          userId : userId
        };
        this.userBars[this.i] = d;
            this.i++;
      }

    });
 
  }

  onSearchChange(value : String) {
    if(value === ''){
      this.userBars = this.allbars;
    }
    else{
      let y = value.toLowerCase();
      let x = this.allbars.filter(data => data.firstname.toLowerCase().indexOf(y) > -1 || data.lastname.toLowerCase().indexOf(y)> -1 || data.email.toLowerCase().indexOf(y) > -1)
        if(x.length> 0)
          this.userBars = x;
        else
          this.userBars = [];
    }
    }

  AccountsPage(userId) {
    this.router.navigate(['/admin/owners/owner',userId]);
  }

}
