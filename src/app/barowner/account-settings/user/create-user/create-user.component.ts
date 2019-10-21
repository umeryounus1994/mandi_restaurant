import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/providers/auth.service';
import { ApiService } from 'src/app/providers/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  userBars = [];
  userId;
  noBars = false;
  register_data = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    package : '',
    firm : '',
    title : '',
    road : '',
    housenumber : '',
    zip : '',
    city : '',
    assignedBar : '',
    assignedBy : '',
    assignedBarName : ''
  };
  loadingText = '';
  errorMessage = '';
  userData ;
  assignedBars;
  userLimit;

  constructor(private auth: AuthService, private api: ApiService, private spinner: NgxSpinnerService, private router : Router) {
    this.userId = JSON.parse(localStorage.getItem('data')).uid;
    this.userLimit = JSON.parse(localStorage.getItem('data')).users;
    this.register_data.assignedBy = this.userId;
   }

  ngOnInit() {
    this.api.getUserBars(this.userId).pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      this.userBars = data;
      if (this.userBars.length < 1) {
        this.noBars = true;
      }
    })
    this.api.getAssignedBars(this.userId).pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      this.spinner.hide();
      this.assignedBars = data;
 
    })
  }
  onSubmit(form: NgForm) {
    // if(this.assignedBars.length < this.userLimit) {
     
     var bar = this.register_data.assignedBar.split(",");
     var barId = bar[0];
     var barName = bar[1];
     this.api.checkAssignedBar(barId).pipe(map((actions: any) => {
       return actions.map(a => {
         const data = a.payload.doc.data()
         const id = a.payload.doc.id;
         return { id, ...data };
       });
     })).subscribe(data => {
       const res = data;
       if(res.length < 1) {
         this.spinner.show();
         if(this.register_data.password != "" && this.register_data.email != "" && this.register_data.assignedBar != "")
         {
         this.auth.adminRegister(this.register_data.email, this.register_data.password).then(user => {
          
           
           this.loadingText = '';
           this.userData = user;
           let data = {
             userId: this.userData.user.uid,
             email: this.register_data.email,
             password: this.register_data.password,
             accountType: 'barmember',
             firstname: "",
             lastname: "",
             firm : "",
             title : "",
             road : "",
             zip : "",
             city : "",
             housenumber : "",
             assignedBar : barId,
             assignedBy : this.register_data.assignedBy,
             assignedBarName : barName,
             status : "active"
           }; 
           
           this.api.addUser(data.userId, data).then(response => {
             this.spinner.hide()
             form.resetForm();
             this.errorMessage = "";
             history.back()
     
             
           });
     
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
       } else {
         this.errorMessage = "";
         this.errorMessage = "Du kannst maximal 1 Benutzer dieser Bar hinzufügen";
       }
     
     });
 
   
 // }
 //  else {
 //   this.errorMessage = "";
 //   this.errorMessage = "Du kannst maximal " + this.userLimit + " Benutzer dieser Bar hinzufügen";
 // }
   }

}
