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
    userId : "",
    categoryId : ""
  };
  loadingText = '';
  errorMessage = '';
  accountType='';
  constructor(private api : ApiService, private auth : AuthService,private spinner: NgxSpinnerService, private router : Router) {
    this.category_data.page = "lunch";
    this.category_data.userId = JSON.parse(localStorage.getItem("data")).uid;
    this.accountType = JSON.parse(localStorage.getItem('data')).accountType;
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
      this.category_data.categoryId = this.auth.makeid();
      this.api.addCategory(this.category_data).then(added => {
        form.resetForm();
          this.loadingText = "";
          this.errorMessage = "";
          this.loadingText = "Category Added Successfully";
        setTimeout(() => {
          this.spinner.hide();
          this.router.navigate(['/bar/karten/lunch']);
        }, 1000);
       

      })
    }
    else
    {
      this.spinner.hide();
      this.errorMessage = "Please add all the information";

    }

  }

}
