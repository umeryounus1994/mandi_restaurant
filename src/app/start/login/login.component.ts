import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../providers/auth.service';
import { ApiService } from '../../providers/api.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  currentUrl: string;
  login_data = {
    email: '',
    password: ''
  };
  userData: any;
  loadingText = '';
  errorMessage = '';
  userSpecific;

  constructor(private router: Router, private auth: AuthService, private api: ApiService, private afs: AngularFirestore
    , private spinner: NgxSpinnerService) {
    router.events.subscribe((_: NavigationEnd) => this.currentUrl = this.router.url);
  }

  ngOnInit() {
  }
  userPackage;
  userBars;
  singlePackage;
  onSubmit(form: NgForm) {
    this.errorMessage = "";
    this.loadingText = "";
    this.spinner.show();
    this.auth.adminLogin(this.login_data.email, this.login_data.password).then(ux => {
      form.resetForm();
      this.loadingText = "Logging in";
      this.userData = ux;

      this.api.getUser1(this.userData.user.uid).pipe(map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(userResponse => {
        if(userResponse.length > 0){
        this.userSpecific = userResponse[0];
        this.auth.saveInfo(userResponse[0].email);
        this.auth.saveLocalTokens(this.userSpecific.userId);
        this.router.navigate(['/bar/karten']);
    } else {
      this.spinner.hide();
      this.errorMessage = "";
      this.loadingText = "";
      this.errorMessage = "Account does not exist";
    }
      });

    }).catch(err => {
      this.spinner.hide();
      this.errorMessage = '';
      this.errorMessage = err.message;

    })
  }

}
