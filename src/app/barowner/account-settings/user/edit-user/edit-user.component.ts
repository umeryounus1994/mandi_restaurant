import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/providers/api.service';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  addUserId;
  account_data = {
    firstname: '',
    lastname: '',
    package : '',
    firm : '',
    title : 'mr',
    road : '',
    housenumber : '',
    zip : '',
    city : '',
    email : '',
    password : ''

  };
  userData ;
  loadingText = "";
  bars;
  title;
  userId;
  userBars;
  barNameId;
  errorMessage='';
  constructor(private route: ActivatedRoute,private api : ApiService, private spinner : NgxSpinnerService, private router : Router) {
    this.route.params.subscribe( params => this.addUserId = params.id);
    this.userId = JSON.parse(localStorage.getItem('data')).uid;
   }

   ngOnInit() {
    this.spinner.show();
    this.api.getUser1(this.addUserId).pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(fetched => {
      this.userData = fetched[0];

      this.spinner.hide();
      this.account_data.firstname = this.userData.firstname;
      this.account_data.lastname = this.userData.lastname;
      this.account_data.firm = this.userData.firm;
      this.account_data.title = this.userData.title;
      this.account_data.road = this.userData.road;
      this.account_data.housenumber = this.userData.housenumber;
      this.account_data.zip = this.userData.zip;
      this.account_data.city = this.userData.city;
      this.title = this.userData.title;
      this.account_data.email = this.userData.email;
      this.account_data.password = this.userData.password;
      this.barNameId = this.userData.assignedBar+","+this.userData.assignedBarName;
    })
    this.api.getUserBars(this.userId).pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      this.userBars = data;
    })
  }

  onSubmit(form: NgForm) {
    // this.spinner.show();
     if(this.barNameId != "")
     {
       var bar = this.barNameId.split(",");
       var barId = bar[0];
       var barName = bar[1];
          let data = {
         assignedBar : barId,
         assignedBarName : barName
       }; 
     this.api.updateUser(this.addUserId,data).then(user => {
       
       this.loadingText = 'Die Benutzerdetails wurden erfolgreich geändert';
    
 
     }).catch(error => {
       this.spinner.hide();
       this.errorMessage = '';
       this.errorMessage = error.message;
       this.loadingText = "";
     });
   }
   else
   {
     this.spinner.hide();
     this.errorMessage = "Bitte füll alle notwendigen Felder aus!";
 
   }
 
   }
   deleteUser() {
     const data = {
       status : "disable"
     };
     this.api.deleteUser(this.addUserId,data).then(deleted => {
       this.loadingText = "";
       this.loadingText = "Der Benutzer wurde erfolgreich gelöscht!";
       this.router.navigate(['/benutzer']);
     })
   }

}
