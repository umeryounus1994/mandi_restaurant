import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/providers/api.service';
import { AuthService } from 'src/app/providers/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-drinks-category',
  templateUrl: './create-drinks-category.component.html',
  styleUrls: ['./create-drinks-category.component.scss']
})
export class CreateDrinksCategoryComponent implements OnInit {

  category_data = {
    categoryName : "",
    price : "",
    page : "",
    barId : "",
    userId : "",
    categoryId : ""
  };
  loadingText = '';
  errorMessage = '';
  accountType='';
  constructor(private api : ApiService, private auth : AuthService,private spinner: NgxSpinnerService, private router : Router) {
    this.category_data.barId = JSON.parse(localStorage.getItem("bar")).barId;
    this.category_data.page = "Getrankekarte";
    this.category_data.userId = JSON.parse(localStorage.getItem("data")).uid;
    this.accountType = JSON.parse(localStorage.getItem('data')).accountType;
    if(this.accountType == "barmember") {
      this.category_data.userId =  JSON.parse(localStorage.getItem('data')).assignedBy;
    }
   }

  ngOnInit() {
  }
  onSubmit(form : NgForm)
  {
    this.errorMessage = "";
    this.loadingText = "";
    this.spinner.show();
    if(this.category_data.categoryName != ""|| this.category_data.price != "")
    {
      this.category_data.categoryId = this.makeid();
      this.api.addCategory(this.category_data).then(added => {
        form.resetForm();
          this.loadingText = "";
          this.errorMessage = "";
          this.loadingText = "Kategorie wurde erfolgreich hinzugefügt!";
        setTimeout(() => {
          this.spinner.hide();
          this.router.navigate(['/bar/karten/getraenke']);
        }, 1000);
       

      })
    }
    else
    {
      this.spinner.hide();
      this.errorMessage = "Bitte füll alle notwendigen Felder aus!";

    }

  }
  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 20; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

}
