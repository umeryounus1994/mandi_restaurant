import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/providers/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/providers/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  userId;
  barName = "";
  barId;
  tables;
  pending = []
  completed = []
  paid = []
  allpending = []
  allcompleted = []
  allpaid = []
  noPending = false;
  noCompleted = false
  noPaid = false
  allTables=[]
  a=1;
  tableNames=[]
  accountType=""
  constructor(private auth : AuthService,private api : ApiService,private spinner : NgxSpinnerService, private router : Router,private afs : AngularFirestore) {
    this.userId = JSON.parse(localStorage.getItem('data')).uid;

    this.accountType = JSON.parse(localStorage.getItem('data')).accountType;
    if(this.auth.accountStatusDisable) {
      this.router.navigate(["/"]);
    }
   }

  ngOnInit() {
    

   window.localStorage.removeItem("cart")
   this.auth.cartData = []
   this.spinner.show();


   this.afs.collection('userOrders', ref=>ref.where("status","==",'pending')).snapshotChanges().pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      if(data.length > 0) {
        this.pending = data;
      
       
        this.allpending = data;
      } else {
        this.noPending = true;
      }
    })
    this.afs.collection('userOrders', ref=>ref.where("status","==",'completed')).snapshotChanges().pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      if(data.length > 0) {
        this.completed = data;
        this.allcompleted = data;
      }else {
        this.noCompleted = true;
      }
    })
    this.afs.collection('userOrders', ref=>ref.where("status","==",'paid')).snapshotChanges().pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      this.spinner.hide()
      if(data.length > 0) {
        this.paid = data;
        this.allpaid = data;
      }else {
        this.noPaid = true;
      }
    })
    
  }


  orderDetail(orderId,orderedBy) {
    this.auth.saveOrderId(orderId,orderedBy);
    this.router.navigate(['bar/bestellung/details']);
  }
  SearchTableWise(tableId) {
    if(tableId != "all") {
    this.noPending = false
    this.noCompleted = false
    this.noPaid = false
    this.pending = []
    this.completed = []
    this.paid = []
    this.spinner.show()
    this.api.searchTableOrders(this.barId,tableId,"pending").pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      if(data.length > 0) {
        this.pending = data;
        this.pending.forEach((element)=> {
          var tableNo=element.tableNo;
          
          this.api.getTables(this.barId)
          .pipe(map((actions: any) => {
            return actions.map(a => {
              const data = a.payload.doc.data()
              const id = a.payload.doc.id;
              return { id, ...data };
            });
          })).subscribe(data => {
            this.tableNames=[]
           
           data.forEach(element1 => {
             if(element1.tableNo == tableNo){
               element.tableName = element1.tableName
             }
           });
          })

        })
      } else {
        this.noPending = true;
      }
    })
    this.api.searchTableOrders(this.barId,tableId,"completed").pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      if(data.length > 0) {
        this.completed = data;
        this.completed.forEach((element)=> {
          var tableNo=element.tableNo;
          
          this.api.getTables(this.barId)
          .pipe(map((actions: any) => {
            return actions.map(a => {
              const data = a.payload.doc.data()
              const id = a.payload.doc.id;
              return { id, ...data };
            });
          })).subscribe(data => {
            this.tableNames=[]
           
           data.forEach(element1 => {
             if(element1.tableNo == tableNo){
               element.tableName = element1.tableName
             }
           });
          })

        })
      }else {
        this.noCompleted = true;
      }
    })
    this.api.searchTableOrders(this.barId,tableId,"paid").pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      this.spinner.hide()
      if(data.length > 0) {
        this.paid = data;
      }else {
        this.noPaid = true;
      }
    })
  } else {
    this.pending = this.allpending
    this.completed = this.allcompleted
    this.paid = this.allpaid

  }

  }

  navigateDownloads() {
    this.router.navigate(['/bar/bestellung/downloads']);
  }

  navigateNewOrder() {
    this.router.navigate(['/bar/bestellung/neu']);
  }

}
