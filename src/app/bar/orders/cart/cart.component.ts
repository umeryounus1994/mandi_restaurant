import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/providers/api.service';
import { AuthService } from 'src/app/providers/auth.service';
import { map, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  orderId;
  orderedByUser;
  userId;
  barId;
  tables
  a=1;
  allTables=[]
  allCartData=[]
  table="";
  currentDate;mm;yy;month;dateExport;
  hours;minutes;userOrders;price=0.0;orderDAta;
  i=0;
  errorMessage=""
  shishaItem=[]
  drinksItem=[]
  foodsItem=[]
  constructor(private api : ApiService, private auth : AuthService,private router : Router,private afs : AngularFirestore) {
    this.userId = JSON.parse(localStorage.getItem('data')).uid;
    this.barId = JSON.parse(localStorage.getItem('bar')).barId;
   }
   result : any
   allValues=[]

  ngOnInit() {
    
    this.api.getTables(this.barId).pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      if(data.length > 0) {
        this.tables = data;

      }
      this.tables.sort(function(a, b){
        var nameA=a.tableNo, nameB=b.tableNo;
        if (nameA < nameB) //sort string ascending
         return -1;
        if (nameA > nameB)
         return 1;
        return 0; //default return value (no sorting)
       });
    })
   
    if(localStorage.getItem("cart") != null) {
      this.allCartData =  JSON.parse(localStorage.getItem('cart')).cart
     
      this.allCartData.forEach(element => {
        this.price = this.price + parseFloat(element.price);
        if(element.page == "Shishakarte"){
          this.shishaItem.push(element);
        }
        if(element.page == "Speisekarte"){
          this.foodsItem.push(element);
        }
        if(element.page == "Getrankekarte"){
          this.drinksItem.push(element);
        }
      });

      this.result = this.groupBy("name", this.shishaItem)
      
     
    }
  }

  groupBy(propertyName, array) {
    var groupedElements = {};

    for(var i = 0; i < array.length; i++) {
        var element = array[i];
        var value = element[propertyName];

        var group = groupedElements[value];
        if(group == undefined) {
            group = [element];
            var ob = {}
            ob['name'] = value;
            ob['items'] = group;
            this.allValues.push(ob)
            groupedElements[value] = group;
        } else {
            group.push(element);
        }
    }

    return groupedElements;
}
 
  remove(data,index) {
    
    if(data.page == "Shishakarte"){
      this.shishaItem.splice(index,1)
    }
    if(data.page=="Speisekarte"){
      this.foodsItem.splice(index,1)
    }
    if(data.page=="Getrankekarte"){
      this.drinksItem.splice(index,1)
    }
    this.allCartData=[]
    this.shishaItem.forEach(element => {
      this.allCartData.push(element)
    });
    this.foodsItem.forEach(element => {
      this.allCartData.push(element)
    });
    this.drinksItem.forEach(element => {
      this.allCartData.push(element)
    });
    localStorage.removeItem("cart");

    this.auth.saveCartData(this.allCartData,'array');

      this.allCartData.forEach(element => {
        this.price = this.price + parseFloat(element.price)
      });
  }
  SearchTableWise(table) {
    this.table=table;
  }

  processOrder() {
    if(this.table != "") {
      if(this.allCartData.length > 0) {
    var today = new Date();
    this.currentDate = today.getDate();
    this.mm = today.getMonth() + 1; //January is 0!
    this.yy = today.getFullYear();


    if (this.mm < 10) {
      this.month = this.mm;
      this.mm = '0' + this.mm
    } else {
      this.month = this.mm
    }
    this.dateExport = this.month + "-" + this.yy;
    var orderDate = this.currentDate + "-" + this.month + "-" + this.yy;
    var h = today.getHours();
    if (h < 10) {
      this.hours = "0" + h
    } else {
      this.hours = h
    }
    var min = today.getMinutes();
    if (min < 10) {
      this.minutes = "0" + min;
    } else {
      this.minutes = min;
    }
    var time = this.hours + ":" + this.minutes;
   

    this.userOrders = {
      barId: this.barId,
      dateExport: this.dateExport,
      orderDate: orderDate,
      orderTime: time.toString(),
      orderedBy: this.userId,
      status: "pending",
      tableNo: this.table,
      total: this.price,
      userName: "Mitarbeiter",
      userOrderId: this.makeid(),
    }
    this.orderDAta = {
      barId: this.barId,
      dateExport: this.dateExport,
      orderDate: orderDate,
      orderTime: h + ":" + this.minutes,
      orderId: this.makeid(),
      tableNo: this.table,
      userId: this.userId,
      userName: "Mitarbeiter",
      userOrderId: this.userOrders.userOrderId
    }
 
    this.allValues.forEach(da => {
        var orderedam = this.result[da.name].length;
       this.afs.collection('menuitems', ref=>ref.where('itemId','==',da.items[0].itemId)).snapshotChanges().pipe(take(1),map((actions: any) => {
          return actions.map(a => {
            const data = a.payload.doc.data()
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })).subscribe(data => {
          if(data[0].itemAmount > 0){
            var amount = data[0].itemAmount;
            if(amount > orderedam){
              var rem = amount-orderedam
            } else {
              var rem = orderedam-amount;
            }
            var dat = {
              itemAmount : rem
            }
            this.afs.doc("menuitems/"+da.items[0].itemId).update(dat);
          }
        })
    })

    this.api.createUserOrder(this.userOrders.userOrderId, this.userOrders).then(done => {

      this.api.createOrder(this.orderDAta.orderId, this.orderDAta).then(done1 => {

        this.allCartData.forEach(sh => {
            var d = {
              itemId : sh.itemId,
              item: sh.name + " : " + sh.price + " €",
              orderId: this.orderDAta.orderId,
              status: "pending",
              page : sh.page,
              orderDetailId: this.makeid()
            }
       
           
            if (this.i < this.allCartData.length) {
              this.api.createOrderDetails(d.orderDetailId, d).then(added => {
   
               
                this.i++;
              })
            }
          })
          localStorage.removeItem("cart")
          this.router.navigate(['/bar'])
          
      })
      
    })
  } else {
    this.errorMessage=""
    this.errorMessage="Dein Warenkorb ist leer."
  }
  } else {
    this.errorMessage=""
    this.errorMessage="Wähle eine Tischnummer aus.";
  }

  }
  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 25; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

}
