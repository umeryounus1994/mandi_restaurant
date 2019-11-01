import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { ApiService } from 'src/app/providers/api.service';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
declare var $ :any;
@Component({
  selector: 'app-edit-shisha-category',
  templateUrl: './edit-shisha-category.component.html',
  styleUrls: ['./edit-shisha-category.component.scss']
})
export class EditShishaCategoryComponent implements OnInit {

  update_data = {
    categoryName : '',
  };
  categoryId;
  loadingText = "";


  constructor(public auth : AuthService,public api : ApiService,private spinner: NgxSpinnerService,private router : Router) {
    $(document).ready(function () {
      $('#categoryprice').mask('#.##0.00', {reverse: true});
    });
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
    })
  }
  onSubmit(form : NgForm) {

    this.loadingText = "";
    this.loadingText = "Editing category";
    this.api.updateCategory(this.categoryId, this.update_data).then(updated => {
      
      setTimeout(() => {
        this.router.navigate(['/bar/karten/breakfast']);
      }, 1000);
     
    
    })

  }
  deleteCategory() {
    this.update_data.categoryName = "";
    this.loadingText = "";
    this.loadingText = "Deleting Category";
    this.api.deleteCategory(this.categoryId).then(deleted => {
      setTimeout(() => {
        this.router.navigate(['/bar/karten/breakfast']);
      }, 2000);
    })

  }

}
