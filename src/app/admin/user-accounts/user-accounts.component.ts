import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/providers/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/providers/api.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-accounts',
  templateUrl: './user-accounts.component.html',
  styleUrls: ['./user-accounts.component.scss']
})
export class UserAccountsComponent implements OnInit {
  allUsers=[];
  userCount=0;
  result=[];
  all=[]

  constructor(private auth : AuthService, private router : Router, private route : ActivatedRoute,
    private spinner : NgxSpinnerService,
    private api : ApiService) {
    var type = JSON.parse(localStorage.getItem('data')).accountType;
    if(type == "barowner")
      {
        this.router.navigate(['/']);
      }
   }
  navigateUser(userId) {
    this.auth.saveAppUserId(userId)
    this.router.navigate(['/admin/users/user']);
  }

  ngOnInit() {
    this.api.getAllAppUsers().pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      this.spinner.hide();
      this.allUsers = data;
      this.all = this.allUsers;
      this.userCount = this.allUsers.length;
      // console.log(this.allUsers)
    })
  }

  onSearchChange(value : String) {
    // if(value != ""){
    //   this.allUsers = [];
    
    //   this.api.getAppUserSearch(value).pipe(map((actions: any) => {
    //     return actions.map(a => {
    //       const data = a.payload.doc.data()
    //       const id = a.payload.doc.id;
    //       return { id, ...data };
    //     });
    //   })).subscribe(data => {
    //     this.allUsers = data;

        if(value === ''){
      this.allUsers = this.all;
    }
    else{
      let y = value.toLowerCase();
      let x = this.all.filter(data => data.firstname.toLowerCase().indexOf(y) > -1 || data.lastname.toLowerCase().indexOf(y)> -1 || data.email.toLowerCase().indexOf(y) > -1  )
        if(x.length> 0)
          this.allUsers = x;
        else
          this.allUsers = [];
    }
    
    //     this.userCount = this.allUsers.length;

    //   })
    // } else {
    //   this.userCount = this.all.length;
    //   this.allUsers = this.all;
    // }
    }

}
