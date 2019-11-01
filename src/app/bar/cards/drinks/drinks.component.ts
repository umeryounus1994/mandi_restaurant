import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { ApiService } from 'src/app/providers/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-drinks',
  templateUrl: './drinks.component.html',
  styleUrls: ['./drinks.component.scss']
})
export class DrinksComponent implements OnInit {

  barId = "";
  categories = [];
  menuItems = [];
  selectedCategory = "";
  originalItems = [];
  constructor(private auth : AuthService, private api : ApiService,private spinner: NgxSpinnerService,private router : Router,
    private afs: AngularFirestore) {
   }

  ngOnInit() {
    this.spinner.show();
    this.afs.collection('categories', ref=>ref.where('page','==','lunch')).snapshotChanges().pipe(map((actions : any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data=>{
        this.categories = data;
        if(this.categories.length >0){
          this.categories.sort(function(a, b){
            var nameA=a.categoryName.toLowerCase(), nameB=b.categoryName.toLowerCase();
            if (nameA < nameB) //sort string ascending
             return -1;
            if (nameA > nameB)
             return 1;
            return 0; //default return value (no sorting)
           });
          
          
            var istCategory = this.categories[0]
            var categoryId = istCategory.categoryId
            this.saveCategory(categoryId)
           }
    })
    this.afs.collection('menuitems', ref=>ref.where('page','==','lunch')).snapshotChanges().pipe(map((actions : any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data=>{
      this.spinner.hide();
      this.menuItems = data;
      this.menuItems.sort(function(a, b){
        var nameA=a.itemName.toLowerCase(), nameB=b.itemName.toLowerCase();
        if (nameA < nameB) //sort string ascending
         return -1;
        if (nameA > nameB)
         return 1;
        return 0; //default return value (no sorting)
       });
      this.originalItems = this.menuItems;
    })
  }
  changeStatus(itemId,st) {
    let data = {
      status : st
    };
    this.api.updateMenuItem(itemId,data).then(added => {
    //  location.reload()
     // this.router.navigate(['/bar/karten/shisha']);
      // setTimeout(() => {
      // }, 1000);
    })
  }
  saveCategory(categoryId) {
    this.menuItems=[];

    this.selectedCategory = categoryId;
    this.auth.clearCategoryId();
     this.auth.saveCategoryId(categoryId);
     if(categoryId != "") {
    this.api.getSearchMenuItems(categoryId).pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      this.menuItems = data;
      this.menuItems.sort(function(a, b){
        var nameA=a.itemName.toLowerCase(), nameB=b.itemName.toLowerCase();
        if (nameA < nameB) //sort string ascending
         return -1;
        if (nameA > nameB)
         return 1;
        return 0; //default return value (no sorting)
       });
    })
  } else {
    this.menuItems = this.originalItems;
  }
     
  }

  editCategory() {
    if(this.selectedCategory != ""){
      this.router.navigate(['/bar/karten/lunch/kategorie-anpassen']);
    }
  }
  
  editMenu(Item) {
    this.auth.saveMenuItem(Item);
    this.router.navigate(['/bar/karten/lunch/eintrag-anpassen']);
  }

  navigateNewCategory() {
    this.router.navigate(['/bar/karten/lunch/kategorie-erstellen']);
  }

  navigateNewMenuItem() {
    this.router.navigate(['/bar/karten/lunch/eintrag-erstellen']);
  }

}
