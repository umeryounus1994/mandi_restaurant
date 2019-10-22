import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { ApiService } from 'src/app/providers/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {

  userId ;
  account_data = {
    firstname: '',
    lastname: '',
    package : '',
    firm : '',
    title : 'mr',
    road : '',
    housenumber : '',
    zip : '',
    city : ''

  };
  userData ;
  loadingText = "";
  bars;
  title;
  currentPackage='';
  showPackage = false;
  splitValue;
  userBars;
  day1;
  day2;
  month1;
  month2;
  errorText = ""
  mail;
  packageId;
  assignedBars=[]

  constructor(private api : ApiService, private spinner : NgxSpinnerService, private router : Router,private auth : AuthService) {
    this.userId = JSON.parse(localStorage.getItem("data")).uid;
    this.bars = JSON.parse(localStorage.getItem("data")).bars;
    this.mail = JSON.parse(localStorage.getItem("data")).email;
    this.packageId = JSON.parse(localStorage.getItem("package")).packageId;
    if(this.packageId === "8n3g") {
      this.currentPackage = "Pro";
    }
    if(this.packageId === "sk2b") {
      this.currentPackage = "Free";
    }
    if(this.packageId === "gm8m") {
      this.currentPackage = "Starter";
    }

    // if(this.bars > 1 && this.bars < 3) {
    //   this.currentPackage = "Starter";
    // } else {
    //   this.currentPackage = "Pro";
    // }
   }

  ngOnInit() {
    this.spinner.show();
    this.api.getUser1(this.userId).pipe(map((actions: any) => {
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

  onSubmit(form : NgForm) {
    if(this.account_data.firstname != "" && this.account_data.lastname != "" && this.account_data.title != "" && this.account_data.road != ""
    && this.account_data.housenumber != "" && this.account_data.zip != "" && this.account_data.city != "") {
    this.api.updateUser(this.userId,this.account_data).then(updated => {
      this.loadingText = "";
      this.loadingText = "Deine Accountdetails wurden erfolgreich geändert!";
      this.auth.saveInfo(this.mail);
      this.router.navigate(['/']);

    })
  } else {
    this.errorText = ""
    this.errorText = "Bitte füll alle Felder aus."
  }
  }
  getTitle(value) {
    this.account_data.title = value;
  }

  navigateCreateUser() {
    this.router.navigate(['/einstellungen/benutzer/erstellen']);
  }

  navigateEditUser(data) {
    this.router.navigate(['/einstellungen/benutzer/anpassen',data.userId]);
  }

}
