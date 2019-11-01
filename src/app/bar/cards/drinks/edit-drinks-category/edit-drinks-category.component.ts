import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { ApiService } from 'src/app/providers/api.service';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-drinks-category',
  templateUrl: './edit-drinks-category.component.html',
  styleUrls: ['./edit-drinks-category.component.scss']
})
export class EditDrinksCategoryComponent implements OnInit {

  update_data = {
    categoryName : '',
    price : ''
  };
  categoryId;
  loadingText = "";
  constructor(public auth : AuthService,public api : ApiService,private spinner: NgxSpinnerService,private router : Router) {
    
  }

  ngOnInit() {
    this.categoryId = JSON.parse(localStorage.getItem("category")).categoryId;
    this.spinner.show();
    this.api.getSpecificCategory(this.categoryId).pipe(map((actions : any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data=>{
      this.spinner.hide();
       this.update_data.categoryName = data[0].categoryName;
       this.update_data.price = data[0].price;
    })
  }
  onSubmit(form : NgForm) {
    this.loadingText = "";
    this.loadingText = "Editing category";
    this.api.updateCategory(this.categoryId, this.update_data).then(updated => {
      
      setTimeout(() => {
        this.router.navigate(['/bar/karten/lunch']);
      }, 1000);
     
    
    })

  }
  deleteCategory() {
    this.update_data.categoryName = "";
    this.update_data.price = "";
    this.loadingText = "";
    this.loadingText = "Deleting Category";
    this.api.deleteCategory(this.categoryId).then(deleted => {
      setTimeout(() => {
        this.router.navigate(['/bar/karten/lunch']);
      }, 1000);
    })
  }

}
