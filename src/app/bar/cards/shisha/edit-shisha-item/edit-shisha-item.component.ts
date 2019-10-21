import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { ApiService } from 'src/app/providers/api.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
declare var $ :any;
@Component({
  selector: 'app-edit-shisha-item',
  templateUrl: './edit-shisha-item.component.html',
  styleUrls: ['./edit-shisha-item.component.scss']
})
export class EditShishaItemComponent implements OnInit {

  itemId = "";
  menu_item = {
    itemName : "",
    itemAmount : "",
    make : "",
    categoryId : "",
    categoryName : "",
    status : ""


  }
  categories = [];
  barId = "";
  loadingText = "";
  cId;
  makee = "";
  constructor(public auth : AuthService,public api : ApiService, public router : Router,private spinner: NgxSpinnerService) { 
    this.barId = JSON.parse(localStorage.getItem("bar")).barId;
    this.itemId = JSON.parse(localStorage.getItem("item")).itemId;
    $(document).ready(function () {
      $('.sPrice').mask('#.##0,00', {reverse: true});
    });
  }
  
    ngOnInit() {
      this.spinner.show();
      this.api.getSingleMenuItem(this.itemId).pipe(map((actions : any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data=>{
        this.spinner.hide();
         this.menu_item.itemName = data[0].itemName;
         if( isNaN(data[0].itemAmount)) {
           this.menu_item.itemAmount=''
          
         } else {
          this.menu_item.itemAmount=data[0].itemAmount
         }
        
         this.menu_item.make = data[0].make;
         this.menu_item.categoryId = data[0].categoryId;
         this.menu_item.categoryName = data[0].categoryName;
         this.cId = data[0].categoryId+","+data[0].categoryName;
         this.menu_item.status = data[0].status;
       
         this.makee = data[0].make;
      })
      this.api.getBarCategories(this.barId,"Shishakarte").pipe(map((actions : any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data=>{
          this.categories = data;
          this.categories.sort(function(a, b){
            var nameA=a.categoryName.toLowerCase(), nameB=b.categoryName.toLowerCase();
            if (nameA < nameB) //sort string ascending
             return -1;
            if (nameA > nameB)
             return 1;
            return 0; //default return value (no sorting)
           });
          
          
      })
  }
  changeStatus(st) {
    let data = {
      status : st
    };
    this.api.updateMenuItem(this.itemId,data).then(added => {
      this.router.navigate(['/bar/karten/shisha']);
      setTimeout(() => {
      }, 1000);
    })
  }

  saveCategory(category) {
    var split = category.split(",");
    this.menu_item.categoryId = split[0];
    this.menu_item.categoryName = split[1];
   }
   allitems = [];
   i=0;
   onSubmit(form : NgForm) {
    if(this.menu_item.make == "no") {
    this.api.updateMenuItem(this.itemId,this.menu_item).then(added => {
      this.loadingText = "Menüeintrag erfolgreich angepasst!"
      this.router.navigate(['/bar/karten/shisha']);
      setTimeout(() => {
      
        //this.router.navigate(['/bar/karten/shisha']);
      }, 1000);
    })
  } else {
    this.api.getBarMakeMenuItems(this.barId,"Shishakarte").pipe(map((actions : any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data=>{
        this.allitems = data;
        if(this.allitems.length > 0 && this.i == 0) {

          let data1 = {
            make : "no"
               };
      this.api.updateMenuItem(this.allitems[0].id, data1).then(updated => {
        this.api.updateMenuItem(this.itemId,this.menu_item).then(up => {
          this.loadingText = "Menüeintrag erfolgreich angepasst!";
          this.router.navigate(['/bar/karten/shisha']);
        })
      }) 
      this.i++;
    } else {
     
      if(this.i == 0)
      {
      this.api.updateMenuItem(this.itemId,this.menu_item).then(up => {
        this.loadingText = "Menüeintrag erfolgreich angepasst!";
        this.router.navigate(['/bar/karten/shisha']);
      })
    }
    this.i++;
    }
 
        let data1 = {
              make : "no"
                 };
        this.api.updateMenuItem(this.allitems[0].id, data1).then(updated => {
          this.api.updateMenuItem(this.itemId,this.menu_item).then(up => {
            this.loadingText = "Menüeintrag erfolgreich angepasst!";
            this.router.navigate(['/bar/karten/shisha']);
          })

        })
  })
  
  }
  }

  makeToday(today) {
    this.menu_item.make = today;
  }
  deleteItem() {
    this.api.deleteMenuItems(this.itemId).then(deleted => {
      this.router.navigate(['/bar/karten/shisha']);
    })
  }

}
