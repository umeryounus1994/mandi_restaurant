import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { ApiService } from 'src/app/providers/api.service';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
declare var $ :any;
@Component({
  selector: 'app-create-shisha-item',
  templateUrl: './create-shisha-item.component.html',
  styleUrls: ['./create-shisha-item.component.scss']
})
export class CreateShishaItemComponent implements OnInit {

  categories = [];
  barId = "";
  menu_item = {
    categoryName : "",
    itemName : "",
    itemAmount : null,
    price : "",
    barId : "",
    userId : "",
    categoryId : "",
    page : "Shishakarte",
    make : "no",
    itemId : "",
    status : "active"
  };
  accountType='';
  loadingText='';
  constructor(public auth : AuthService, public api : ApiService, private spinner : NgxSpinnerService, private router : Router) {
    this.barId = JSON.parse(localStorage.getItem("bar")).barId;
    this.menu_item.userId = JSON.parse(localStorage.getItem("data")).uid;
    this.accountType = JSON.parse(localStorage.getItem('data')).accountType;
    if(this.accountType == "barmember") {
      this.menu_item.userId =  JSON.parse(localStorage.getItem('data')).assignedBy;
    }
    this.menu_item.barId = this.barId;
    $(document).ready(function () {
      $('.sPrice').mask('#.##0,00', {reverse: true});
    });
   }

  ngOnInit() {
    this.menu_item.itemId = this.makeid();
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
    
    if(this.menu_item.make == "no") {
      this.spinner.show();
    this.api.addMenuItem(this.menu_item).then(added => {
      form.resetForm();
      this.loadingText = "Menüeintrag erfolgreich erstellt!"
      setTimeout(() => {
        this.spinner.hide();
        this.router.navigate(['/bar/karten/shisha']);
      }, 1000);
    })
  } else {
    this.spinner.show();
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
            this.router.navigate(['/bar/karten/shisha']);
          })
        }) 
        this.i++;
      } else {
       
        if(this.i == 0)
        {
          this.api.addMenuItem(this.menu_item).then(added => {
          this.loadingText = "Menüeintrag erfolgreich angepasst!";
          this.router.navigate(['/bar/karten/shisha']);
        })
      }
      this.i++;
      }

      //     let data1 = {
      //       make : "no"
      //          };
      // this.api.updateMenuItem(this.allitems[0].id, data1).then(updated => {
      //   this.api.updateMenuItem(this.menu_item.itemId,this.menu_item).then(up => {
      //     this.loadingText = "Menüeintrag erfolgreich erstellt!";
           
      //       setTimeout(() => {
      //         this.spinner.hide();
      //       this.router.navigate(['/bar/karten/shisha']);
      //       }, 1000);
      //   })
    
      // })
      //     for(var i =0 ; i < this.allitems.length;i++) {
      //       let data = {
      //         make : "no"
      //       };
      //       if(this.allitems[i].itemId != this.menu_item.itemId)
      //       {
      //       this.api.updateMenuItem(this.allitems[i].itemId,data).then(updated => {
      //       })
      //       }
  
      //     }

      //     this.api.addMenuItem(this.menu_item).then(added => {
      //       form.resetForm();
      //       this.loadingText = "Menüeintrag erfolgreich erstellt!";
           
      //       setTimeout(() => {
      //         this.spinner.hide();
      //       this.router.navigate(['/bar/karten/shisha']);
      //       }, 1000);
          
      // })
     
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
