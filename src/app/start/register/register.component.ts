import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AuthService } from '../../providers/auth.service';
import { ApiService } from '../../providers/api.service';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import {Http, Headers, Response, RequestOptions} from '@angular/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  currentUrl: string;
  register_data = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    package: '',
    firm: '',
    title: '',
    road: '',
    housenumber: '',
    zip: '',
    city: '',
    status : 'active'
  };
  userData: any;
  loadingText = '';
  errorMessage = '';
  packages = [];
  payment;
  showPackage = false;
  warningAt : any;
  expiresAt : any;
  month1;
  month2;
  day1;
  day2;
  

  constructor(private router: Router, public afs: AngularFirestore, private auth: AuthService, private api: ApiService
    , private spinner: NgxSpinnerService, private http : Http) {
    router.events.subscribe((_: NavigationEnd) => this.currentUrl = this.router.url);
  }

  ngOnInit() {
    this.api.getPackages().pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      this.packages = data;
    })

    this.auth.savePayment(0);
    
  }
  userBars;
  package;
  onSubmit(form: NgForm) {

        this.loadingText = "";
        this.errorMessage = "";
        this.spinner.show();
        if (this.register_data.password != "" || this.register_data.email != "") {

          this.auth.adminRegister(this.register_data.email, this.register_data.password).then(user => {


            this.loadingText = '';
            this.userData = user;
            let data = {
              userId: this.userData.user.uid,
              email: this.register_data.email,
              password: this.register_data.password,
              status : "active",
            };
            this.api.addUser(data.userId, data).then(response => {
              // form.resetForm();
              this.errorMessage = "";
              this.spinner.hide();
              setTimeout(() => {
                  this.router.navigate(['/login']);
              }, 2000);
  
            });
          }).catch(error => {
            this.spinner.hide();
            this.errorMessage = '';
            this.errorMessage = error.message;
            this.loadingText = "";
          });
        }
        else {
          this.spinner.hide();
          this.errorMessage = "Fill all the fields";
        }
  }
}

