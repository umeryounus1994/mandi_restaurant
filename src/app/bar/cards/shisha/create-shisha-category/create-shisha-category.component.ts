import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/providers/api.service';
import { AuthService } from 'src/app/providers/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
declare var $ :any;
@Component({
  selector: 'app-create-shisha-category',
  templateUrl: './create-shisha-category.component.html',
  styleUrls: ['./create-shisha-category.component.scss']
})
export class CreateShishaCategoryComponent implements OnInit {

  category_data = {
    categoryName : "",
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
    this.category_data.page = "Shishakarte";
    this.category_data.userId = JSON.parse(localStorage.getItem("data")).uid;
    this.accountType = JSON.parse(localStorage.getItem('data')).accountType;
    if(this.accountType == "barmember") {
      this.category_data.userId =  JSON.parse(localStorage.getItem('data')).assignedBy;
    }
   }

  ngOnInit() {
    $(document).ready(function () {
      $('#categoryprice').mask('#.##0,00', {reverse: true});
    });
  }

  onSubmit(form : NgForm)
  {
    this.errorMessage = "";
    this.loadingText = "";
     this.spinner.show();
    if(this.category_data.categoryName != "")
    {
      this.category_data.categoryId = this.auth.makeid();
      this.api.addCategory(this.category_data).then(added => {
        form.resetForm();
          this.loadingText = "";
          this.errorMessage = "";
          this.loadingText = "Category Added Successfully";
        setTimeout(() => {
          this.spinner.hide();
          this.router.navigate(['/bar/breakfast/shisha']);
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