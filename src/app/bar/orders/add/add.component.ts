import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/providers/api.service';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/providers/auth.service';
import { CartService } from 'src/app/providers/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  shishaCard=false;
  drinksCard=false;
  foodCard=false;
  orderId;
  orderedByUser;
  userId;
  barId;
  page="";
  category="";
  showCategory=false;
  categories=[]
  menuItems=[]
  allItems=[]
  pageItems=[]
  itemsNo;
  errorText=''
  constructor(private api : ApiService, private auth : AuthService,private cart : CartService, private router: Router) {
   this.userId = JSON.parse(localStorage.getItem('data')).uid;
   this.barId = JSON.parse(localStorage.getItem('bar')).barId;
   }

  ngOnInit() {
   
    this.api.checkMenuItems(this.barId, "Shishakarte").pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      if (data.length > 0) {
        this.shishaCard = true;
      } else {
        this.shishaCard = false;
      }
      if(this.shishaCard == true && this.drinksCard == false && this.foodCard == false){
        this.onChangePage("Shishakarte")
      }
    
    });

    this.api.checkMenuItems(this.barId, "Getrankekarte").pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      if (data.length > 0) {
        this.drinksCard = true;
      } else {
        this.drinksCard = false;
      }
      if(this.shishaCard == false && this.drinksCard == true && this.foodCard == false){
        this.onChangePage("Getrankekarte")
      }
    });
    this.api.checkMenuItems(this.barId, "Speisekarte").pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {

      if (data.length > 0) {
        this.foodCard = true;
      } else {
        this.foodCard = false;
      }
      if(this.shishaCard == false && this.drinksCard == false && this.foodCard == true){
        this.onChangePage("Speisekarte")
      }
    });
  
    if(localStorage.getItem("cart") != null) {
      var val = JSON.parse(localStorage.getItem("cart")).cart;
    this.itemsNo = val.length;
    }
   
    
  }
  onChangePage(value) {
    if(value != "all") {
      this.category=""
      this.showCategory=true;
      this.categories=[]
      this.menuItems=[]
      this.pageItems=[]
      this.api.getCategories(this.barId,value).pipe(map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data => {
        this.categories=data;
        this.categories.sort(function(a, b){
          var nameA=a.categoryName.toLowerCase(), nameB=b.categoryName.toLowerCase();
          if (nameA < nameB) //sort string ascending
           return -1;
          if (nameA > nameB)
           return 1;
          return 0; //default return value (no sorting)
         });
         if(this.categories.length > 0){
          this.api.getMenuItemsBasedOnCategory(this.categories[0].categoryId).pipe(map((actions: any) => {
            return actions.map(a => {
              const data = a.payload.doc.data()
              const id = a.payload.doc.id;
              return { id, ...data };
            });
          })).subscribe(data => {
           
            if (data.length > 0) {
              this.menuItems = data;
             
              this.menuItems.sort(function(a, b){
                var nameA=a.itemName.toLowerCase(), nameB=b.itemName.toLowerCase();
                if (nameA < nameB) //sort string ascending
                 return -1;
                if (nameA > nameB)
                 return 1;
                return 0; //default return value (no sorting)
               });
              
              
              this.pageItems= data;
            } 
          });
         }
       
      });
 
    } else {
      this.menuItems = this.allItems
      this.showCategory=false;
    }
    this.page = value;
  }
  onChangeCategory(value) {
    if(value != "all") {
    this.menuItems=[]
    this.api.getMenuItemsBasedOnCategory(value).pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      this.menuItems=data;
    });
  } else {
    this.menuItems = this.pageItems
  }
  }
  addToCart(product) {
    if(product.page == "Shishakarte") {

      this.api.getCategoryPrice(product.categoryId).subscribe(data => {
     
        if(product.itemAmount > 0 ){
          product.itemAmount = product.itemAmount-1;
          let d = data.data();
          let cartData = {
            itemId : product.itemId,
            name : product.itemName,
            itemAmount : product.itemAmount,
            categoryName : product.categoryName,
            page : product.page,
            price : d.price,
            barId : product.barId
          }
          this.auth.saveCartData(cartData,'');
          var val = JSON.parse(localStorage.getItem("cart")).cart;
          
          this.itemsNo = val.length;
        } else if (isNaN(product.itemAmount)) {
          let d = data.data();
          let cartData = {
            itemId : product.itemId,
            name : product.itemName,
            itemAmount : product.itemAmount,
            categoryName : product.categoryName,
            page : product.page,
            price : d.price,
            barId : product.barId
          }
          this.auth.saveCartData(cartData,'');
          var val = JSON.parse(localStorage.getItem("cart")).cart;

          this.itemsNo = val.length;
        } else {
         this.errorText = "Leider kannst du " + product.itemName + " nicht häufiger bestellen."
        }
     
      });
    } else {
      let cartData = {
        itemId : product.itemId,
        name : product.itemName,
        categoryName : product.categoryName,
        page : product.page,
        price : product.price,
        barId : product.barId
      }
      this.auth.saveCartData(cartData,'');
      var val = JSON.parse(localStorage.getItem("cart")).cart;
      this.itemsNo = val.length;
    }
  }

  navigateCart() {
    this.router.navigate(['/bar/bestellung/warenkorb']);
  }
}
