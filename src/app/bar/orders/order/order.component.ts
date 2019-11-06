import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "src/app/providers/api.service";
import { NgxSpinnerService } from "ngx-spinner";
import { map, take } from "rxjs/operators";
import { Location } from "@angular/common";
import * as _ from "lodash";
import { AngularFirestore } from "angularfire2/firestore";
declare var $ :any;
@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.scss"]
})
export class OrderComponent implements OnInit {
  orderId;
  barId;
  userId;
  orderStatus = "";
  orderDetails = [];
  orderedBy = "";
  orderDate = "";
  orderTime = "";
  tableNo = "";
  orderTotal;
  errorMessage = "";
  loadingText = "";
  successMessage = "";
  orderedByUser = "";
  orderData = [];
  orderTimings = [];
  i = 0;
  total: any;
  shishaItems = [];
  foodsItem = [];
  drinksItem = [];
  allItems = [];
  result:any
  tableName=""
  orderedByUserId;
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private spinner: NgxSpinnerService,
    private location: Location,
    private router: Router,
    private afs: AngularFirestore
  ) {
    this.orderId = JSON.parse(localStorage.getItem("order")).orderId;
    this.orderedByUser = JSON.parse(localStorage.getItem("order")).orderedBy;
    this.userId = JSON.parse(localStorage.getItem("data")).uid;
  }

  ngOnInit() {
    this.orderData = [];
    this.spinner.show();
    this.api
      .getOrderStatus(this.orderId)
      .pipe(
        map((actions: any) => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      )
      .subscribe(data => {
        if (data.length > 0) {
        
          this.orderStatus = data[0].status;
          this.orderedBy = data[0].userName;
          this.orderedByUserId = data[0].orderedBy
          this.orderDate = data[0].orderDate;
          this.orderTime = data[0].orderTime;
          this.orderTotal = data[0].total;

          if (this.orderTotal.toString().indexOf(".") != -1) {
            this.orderTotal = parseFloat(this.orderTotal).toFixed(2);
            this.total = this.orderTotal.toString();
          } else {
            this.total = this.orderTotal;
          }
          //this.total =  this.orderTotal.toString().replace(".",",");
          if (this.orderStatus == "paid") {
            this.successMessage = "";
            this.successMessage =
              "Order Has already been paid";
          }
        }
      });
    let orderDetails = this.afs.collection('orders', ref=>ref.where('userOrderId','==',this.orderId).orderBy("orderTime","desc"))
    .snapshotChanges()
      .pipe(
        map((actions: any) => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      )
      .subscribe(data => {
        this.spinner.hide();
        if (data.length > 0) {
          this.orderDetails = data;
         
          this.orderDetails.forEach(oData => {
            var time = {
              orderTime: oData.orderTime
            };
            this.afs.collection('orderDetails', ref=>ref.where('orderId','==',oData.orderId)).snapshotChanges()
              .pipe(
                map((actions: any) => {
                  return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return { id, ...data };
                  });
                })
              )
              .subscribe(data => {
                this.syncAllData(oData.orderTime, data);
              });
             
          });

        }
      });
    // orderDetails.unsubscribe()
  }
  changestatus(status, Id,order) {
    
   if(order.status == "completed" && order.page == "Shishakarte"){
    this.afs.collection('menuitems', ref=>ref.where('itemId','==',order.itemId)).snapshotChanges().pipe(take(1),map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      if(data[0].itemAmount >= 0){
        var amount = data[0].itemAmount;
        var amtoAdd=1
  
          var rem = parseInt(amtoAdd.toString())+ parseInt(amount);
        
        var dat = {
          itemAmount : rem
        }
        this.afs.doc("menuitems/"+order.itemId).update(dat);
      }
    })
   }
   let d = {
          status: status
        };
        this.afs
          .doc("orderDetails/" + Id)
          .update(d)
          .then(done => {
            this.spinner.hide();
            location.reload();
          });
  
  }

  noItems=[]
  syncAllData(ordTime, ordData) {
   
    if (ordData.length > 0) {
      this.noItems=[]
      this.shishaItems = [];
      this.drinksItem = [];
      this.foodsItem = [];
      this.allItems = [];
      ordData.forEach(element => {
        if (element.page == "breakfast") {
          this.shishaItems.push(element);
        }
        if (element.page == "lunch") {
          this.drinksItem.push(element);
        }
        if (element.page == "Speisekarte") {
          this.foodsItem.push(element);
        }
        if (element.page == "") {
          this.noItems.push(element);
        }
      });
     

      this.allItems.push(this.shishaItems);
      this.allItems.push(this.drinksItem);
      this.allItems.push(this.foodsItem);
      this.allItems.push(this.noItems)

      this.result = this.groupBy("item", this.shishaItems)
     

      var data = {
        orderDeatils: this.allItems
      };

      this.orderData[this.i] = data;
      this.orderData[this.i].oTime = ordTime;
      if(this.i > 0){
        this.orderData.sort(function(a, b){
          var keyA = new Date(a.oTime),
              keyB = new Date(b.oTime);
          // Compare the 2 dates
          if(keyA < keyB) return -1;
          if(keyA > keyB) return 1;
          return 0;
      });
     
      }
     
      this.i++;
    }
  }
  allValues=[]

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
  deleteItem(orderId,order) {
    
    
    this.afs.collection('menuitems', ref=>ref.where('itemId','==',order.itemId)).snapshotChanges().pipe(take(1),map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
     if(data[0].page=="Shishakarte"){
      this.afs.collection('categories', ref=>ref.where('categoryId','==',data[0].categoryId)).snapshotChanges().pipe(take(1),map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data1 => {
       var price = data1[0].price.toString().replace(",",".");
       var finalPrice = parseInt(this.total) - parseInt(price);
        const dataaa = {
          total : finalPrice
        }
        this.api.updateOrderStatus(this.orderId,dataaa);
      })
     } else {
      
      this.afs.collection('menuitems', ref=>ref.where('itemId','==',order.itemId)).snapshotChanges().pipe(take(1),map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data2 => {
        var price = data2[0].price.toString().replace(",",".");
       var finalPrice = parseInt(this.total) - parseInt(price);
        const dataaa = {
          total : finalPrice
        }
        this.api.updateOrderStatus(this.orderId,dataaa);


      })
     }
      if(data[0].itemAmount >= 0){
        var amount = data[0].itemAmount;
  
          var rem = parseInt(amount) + 1;
        
        var dat = {
          itemAmount : rem
        }
        this.afs.doc("menuitems/"+order.itemId).update(dat);
      }
    })
    this.spinner.show();
    this.afs
      .doc("orderDetails/" + orderId)
      .delete()
      .then(done => {
        this.spinner.hide();
        location.reload();
      });
  }
  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 25; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
  AddZero(num) {
    return (num >= 0 && num < 10) ? "0" + num : num + "";
}
getNowDateTimeStr(){
  var now = new Date();
  var hour: any = now.getHours();
  
  var hours :any = now.getHours();
  var minutes : any = now.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  

 return [[this.AddZero(now.getDate()), this.AddZero(now.getMonth() + 1), now.getFullYear()].join("-"), 
 [this.AddZero(hours), minutes,this.AddZero(now.getSeconds())].join(":"), ampm];
 }
 timeConvertor(time) {
  var PM = time.match('am') ? true : false
  
  time = time.split(':')
  var min = time[1]
  
  if (PM) {
      var hour : any = 12 + parseInt(time[0],10)
      var sec = time[2].replace('pm', '')
  } else {
      var hour : any = time[0]
      var sec = time[2].replace('am', '')       
  }
  var sttime : any = hour + ':' + min + ':' + sec
  return sttime
  

}
  markAsCompleted() {
    let data = {
      status: "completed"
    };
   var oDate = this.getNowDateTimeStr();
   var changedDate = oDate[1]+""+oDate[2]
   var d = this.timeConvertor(changedDate)
   var sliced = d.substring(0, d.length - 2);
   var notdate = oDate[0]+" "+sliced;
  

    this.api.updateOrderStatus(this.orderId, data).then(updated => { });
    let notData = {
      notificationId : this.makeid(),
      title : "Bestellung fertig",
      body : "Wir wünschen dir einen angenehmen Aufenthalt in unserer Bar und bedanken uns für deine Bestellung.",
      userId : this.orderedByUserId,
      notDate : notdate, 
    }
    this.afs.doc('notifications/'+notData.notificationId).set(notData)

    this.afs
      .collection("orders", ref => ref.where("userOrderId", "==", this.orderId))
      .snapshotChanges()
      .pipe(take(1),
        map((actions: any) => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      )
      .subscribe(data => {
        data.forEach(element => {
          var OrderId = element.orderId;
          this.afs
            .collection("orderDetails", ref =>
              ref.where("orderId", "==", OrderId)
            )
            .snapshotChanges()
            .pipe(take(1),
              map((actions: any) => {
                return actions.map(a => {
                  const data = a.payload.doc.data();
                  const id = a.payload.doc.id;
                  return { id, ...data };
                });
              })
            )
            .subscribe(data => {
              data.forEach(element => {
                var s = {
                  status: "completed"
                };
                this.afs.doc("orderDetails/" + element.orderDetailId).update(s);
              });
            });
        });
      });

    this.router.navigate(["/bar"]);
  }

  markAsPaid() {
    if (this.orderStatus == "pending") {
      this.errorMessage = "";
      this.errorMessage = "Die Bestellung wurde bezahlt.";
    } else {
      let data = {
        status: "paid"
      };
      var oDate = this.getNowDateTimeStr();
      var changedDate = oDate[1]+""+oDate[2]
      var d = this.timeConvertor(changedDate)
      var sliced = d.substring(0, d.length - 2);
      var notdate = oDate[0]+" "+sliced;
   
      this.api.updateOrderStatus(this.orderId, data).then(updated => { });
      let notData = {
        notificationId : this.makeid(),
        title : "Bestellung erfolgreich bezahlt",
        body : "Wir bedanken uns für deinen Besuch und freuen uns, dich bald wieder begrüßen zu dürfen.",
        userId : this.orderedByUserId,
        notDate : notdate, 
      }
      this.afs.doc('notifications/'+notData.notificationId).set(notData)
      this.afs
        .collection("orders", ref =>
          ref.where("userOrderId", "==", this.orderId)
        )
        .snapshotChanges()
        .pipe(take(1),
          map((actions: any) => {
            return actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return { id, ...data };
            });
          })
        )
        .subscribe(data => {
          data.forEach(element => {
            var OrderId = element.orderId;
            this.afs
              .collection("orderDetails", ref =>
                ref.where("orderId", "==", OrderId)
              )
              .snapshotChanges()
              .pipe(take(1),
                map((actions: any) => {
                  return actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return { id, ...data };
                  });
                })
              )
              .subscribe(data => {
                data.forEach(element => {
                  var s = {
                    status: "paid"
                  };
                  this.afs
                    .doc("orderDetails/" + element.orderDetailId)
                    .update(s);
                });
              });
          });
        });

        this.allValues.forEach(da => {
          var orderedam = this.result[da.name].length;
         this.afs.collection('menuitems', ref=>ref.where('itemId','==',da.items[0].itemId)).snapshotChanges().pipe(take(1),map((actions: any) => {
            return actions.map(a => {
              const data = a.payload.doc.data()
              const id = a.payload.doc.id;
              return { id, ...data };
            });
          })).subscribe(data => {
            if(data[0].itemAmount >= 0){
              var amount = data[0].itemAmount;
        
                var rem = parseInt(orderedam)+ parseInt(amount);
              
              var dat = {
                itemAmount : rem
              }
              this.afs.doc("menuitems/"+da.items[0].itemId).update(dat);
            }
          })
      })

      
    }
    this.router.navigate(["/bar"]);
  }
}
