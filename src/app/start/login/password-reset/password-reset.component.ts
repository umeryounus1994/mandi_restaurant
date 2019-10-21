import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as firebase from 'firebase';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  email;
  loadingText='';
  errorMessage='';
  constructor() { }

  ngOnInit() {
  }
  onSubmit(form : NgForm) {
    
    var auth = firebase.auth();
    return auth.sendPasswordResetEmail(this.email)
      .then(() => this.loadingText = "Ein Link zum zurücksetzen deines Passworts, wurde an deine angegebene Mail verschickt!")
      .catch((error) => this.errorMessage = error)
     

  }

}
