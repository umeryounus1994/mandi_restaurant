import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { ApiService } from 'src/app/providers/api.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
declare var $ :any;
@Component({
  selector: 'app-edit-drinks-item',
  templateUrl: './edit-drinks-item.component.html',
  styleUrls: ['./edit-drinks-item.component.scss']
})
export class EditDrinksItemComponent implements OnInit {

  itemId = "";
  menu_item = {
    itemName : "",
    make : "",
    categoryId : "",
    categoryName : "",
    price : "",
    status : ""
  }
  categories = [];
  barId = "";
  loadingText = "";
  cId;
  makee = "";
  userId;
  constructor(public auth : AuthService,public api : ApiService, public router : Router,private spinner: NgxSpinnerService) { 
    this.barId = JSON.parse(localStorage.getItem("bar")).barId;
    this.itemId = JSON.parse(localStorage.getItem("item")).itemId;
    this.userId = JSON.parse(localStorage.getItem("data")).uid;
    $(document).ready(function () {
      $('#menuitemprice').mask('#.##0,00', {reverse: true});
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
       this.menu_item.make = data[0].make;
       this.menu_item.categoryId = data[0].categoryId;
       this.menu_item.categoryName = data[0].categoryName;
       this.menu_item.price = data[0].price;
       this.cId = data[0].categoryId+","+data[0].categoryName;
       this.menu_item.status = data[0].status;
       this.makee = data[0].make;
      
    })
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
        
    })
}

saveCategory(category) {
  var split = category.split(",");
  this.menu_item.categoryId = split[0];
  this.menu_item.categoryName = split[1];
 }
 changeStatus(st) {
  let data = {
    status : st
  };
  this.api.updateMenuItem(this.itemId,data).then(added => {
    this.router.navigate(['/bar/karten/getraenke']);
    setTimeout(() => {
    }, 1000);
  })
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
  this.api.updateMenuItem(this.itemId,this.menu_item).then(added => {
    form.resetForm();
    this.loadingText = "Menüeintrag wurde erfolgreich angepasst!"
    this.router.navigate(['/bar/karten/getraenke']);
    setTimeout(() => {
      
      //location.reload();
    }, 1000);
  })
} else {
  this.api.getBarMakeMenuItems(this.barId,"Getrankekarte").pipe(map((actions : any) => {
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
      this.router.navigate(['/bar/karten/getraenke']);
    })
  }) 
  this.i++;
} else {
 
  if(this.i == 0)
  {
  this.api.updateMenuItem(this.itemId,this.menu_item).then(up => {
    this.loadingText = "Menüeintrag erfolgreich angepasst!";
    this.router.navigate(['/bar/karten/getraenke']);
  })
}
this.i++;
}
      // for(var i =0 ; i < this.allitems.length;i++) {
      //   let data = {
      //     make : "no"
      //   };
      //   if(this.allitems[i].itemId != this.itemId)
      //   {
      //   this.api.updateMenuItem(this.allitems[i].itemId,data).then(updated => {
      //   })
      //   }

      // }

      // this.api.updateMenuItem(this.itemId,this.menu_item).then(added => {
        
      //   this.loadingText = "Menüeintrag wurde erfolgreich angepasst!";
      //  this.router.navigate(['/bar/karten/getranke']);
      //   setTimeout(() => {
    
          
      //   }, 1000);
      
  //})
 
})

}
}
// onSubmit(form : NgForm) {
//   this.loadingText = "Updating...."
//   this.api.updateMenuItem(this.itemId,this.menu_item).then(added => {
//     form.resetForm();
//     setTimeout(() => {
//       this.spinner.hide();
//       this.router.navigate(['/bar/karten/getranke']);
//     },2000);
//   })

// }

makeToday(today) {
  this.menu_item.make = today;
}

deleteItem() {
  this.api.deleteMenuItems(this.itemId).then(deleted => {
    this.router.navigate(['/bar/karten/getraenke']);
  })
}

}
