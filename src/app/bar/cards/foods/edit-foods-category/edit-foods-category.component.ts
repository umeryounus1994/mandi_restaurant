import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { ApiService } from 'src/app/providers/api.service';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-foods-category',
  templateUrl: './edit-foods-category.component.html',
  styleUrls: ['./edit-foods-category.component.scss']
})
export class EditFoodsCategoryComponent implements OnInit {

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
    this.api.getSpecificCategory(this.categoryId).pipe(map((actions : any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data=>{
       this.update_data.categoryName = data[0].categoryName;
       this.update_data.price = data[0].price;
    })
  }
  onSubmit(form : NgForm) {
    this.spinner.show();
    this.loadingText = "";
    this.loadingText = "Kategorie wurde erfolgreich angepasst!";
    this.api.updateCategory(this.categoryId, this.update_data).then(updated => {
      
      setTimeout(() => {
        this.spinner.hide();
        this.router.navigate(['/bar/karten/speisen']);
      }, 1000);
     
    
    })

  }
  deleteCategory() {
    this.update_data.categoryName = "";
    this.update_data.price = "";
    this.loadingText = "";
    this.loadingText = "Kategorie wurde erfolgreich gelöscht!";
    this.spinner.show();
    this.api.deleteCategory(this.categoryId).then(deleted => {
      setTimeout(() => {
        this.spinner.hide();
        this.router.navigate(['/bar/karten/speisen']);
      }, 1000);
    })

  }

}
