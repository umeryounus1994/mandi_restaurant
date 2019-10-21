import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { ApiService } from 'src/app/providers/api.service';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
declare var $ :any;
@Component({
  selector: 'app-create-drinks-item',
  templateUrl: './create-drinks-item.component.html',
  styleUrls: ['./create-drinks-item.component.scss']
})
export class CreateDrinksItemComponent implements OnInit {

  categories = [];
  barId = "";
  menu_item = {
    categoryName : "",
    itemName : "",
    itemAmount : "",
    price : "",
    barId : "",
    userId : "",
    categoryId : "",
    page : "Getrankekarte",
    make : "no",
    itemId : "",
    status : "active"
  };
  accountType='';
  loadingText = '';
  constructor(public auth : AuthService, public api : ApiService, private spinner : NgxSpinnerService, private router : Router) {
    this.barId = JSON.parse(localStorage.getItem("bar")).barId;
    this.menu_item.userId = JSON.parse(localStorage.getItem("data")).uid;
    this.menu_item.barId = this.barId;
    this.accountType = JSON.parse(localStorage.getItem('data')).accountType;
    if(this.accountType == "barmember") {
      this.menu_item.userId =  JSON.parse(localStorage.getItem('data')).assignedBy;
    }
    $(document).ready(function () {
      $('#menuitemprice').mask('#.##0,00', {reverse: true});
    });
   }

   ngOnInit() {
    this.menu_item.itemId = this.makeid();
    this.api.getBarCategories(this.barId,"Getrankekarte").pipe(map((actions : any) => {
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
        
        this.menu_item.categoryId= this.categories[0].categoryId;
        this.menu_item.categoryName=this.categories[0].categoryName
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
    var regex = /^[0-9,\b]+$/;
    if (!regex.test(this.menu_item.price)) {
      this.loadingText=""
      this.loadingText="Price must be a number or comma";
      return false;
    }
    if(this.menu_item.make == "no") {
    this.api.addMenuItem(this.menu_item).then(added => {
      
      this.loadingText = "Menüeintrag wurde erfolgreich erstellt!"
      setTimeout(() => {
        
        this.router.navigate(['/bar/karten/getraenke']);
      }, 1000);
    })
  } else {
    this.api.getBarMakeMenuItems(this.barId,this.menu_item.page).pipe(map((actions : any) => {
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
        this.api.addMenuItem(this.menu_item).then(added => {
          this.loadingText = "Menüeintrag erfolgreich angepasst!";
          this.router.navigate(['/bar/karten/getraenke']);
        })
      }) 
      this.i++;
    } else {
     
      if(this.i == 0)
      {
        this.api.addMenuItem(this.menu_item).then(added => {
        this.loadingText = "Menüeintrag erfolgreich angepasst!";
        this.router.navigate(['/bar/karten/getraenke']);
      })
    }
    this.i++;
    }
  })

  }
  }
 

   makeToday(today) {
     this.menu_item.make = today;
   }
   makeid() {
     var text = "";
     var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
     for (var i = 0; i < 20; i++)
       text += possible.charAt(Math.floor(Math.random() * possible.length));
     return text;
   }

}
