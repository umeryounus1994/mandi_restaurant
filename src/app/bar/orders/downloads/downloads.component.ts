import { Component, OnInit } from '@angular/core';
import { ExportService } from 'src/app/providers/export.service';
import { ApiService } from 'src/app/providers/api.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { ExportToCsv } from 'export-to-csv';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss']
})
export class DownloadsComponent implements OnInit {
  dd:any
  mm:any
  today:any
  yy:any
  todayDate : any
  month: any
  dateToCompare : any
  dataArray: any = [];
  barId;
  allData = []
  errorText = "";
  lastMonthData = []
  lData = []
  lastMonthCompare = ""
  lastMonthDate = ""
  currentDate : any
  oldRecordData = []
  barName = "";

  constructor(private xls : ExportService, private api : ApiService, private router : Router, private afs : AngularFirestore,
    private db : AngularFireDatabase) {
    this.barId = JSON.parse(localStorage.getItem('bar')).barId;
    this.barName = JSON.parse(localStorage.getItem("bar")).barName;
    
    var today = new Date();
    this.currentDate = today.getDate();
     this.mm = today.getMonth()+1; //January is 0!
     this.yy = today.getFullYear();

    if(this.mm<10) {
      this.month = this.mm;
        this.mm = '0'+this.mm
    } else {
      this.month = this.mm
    }
    this.dateToCompare = this.month + "-" + this.yy;
    this.lastMonthCompare = this.month-1 + "-" + this.yy;
    this.todayDate = this.month_name(this.month-1) + " " + this.yy;
    this.lastMonthDate = this.month_name(this.month-2) + " " + this.yy;
   }
   i=1;
   j=1;
  ngOnInit() {
    this.barName = JSON.parse(localStorage.getItem("bar")).barName;

    this.api.getMonthDownloads(this.dateToCompare,this.barId).pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      if(data.length > 0) {
        this.allData = data;
        this.allData.forEach(item => {
          var d = {
            serialNo : this.i,
            orderDate: item.orderDate,
            orderTime : item.orderTime,
            tableNumber : item.tableNo,
            total : item.total + " €"
          }
          this.dataArray.push(d);
          this.i++;
        })
      }
    })
  
    this.api.getMonthDownloads(this.lastMonthCompare,this.barId).pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      if(data.length > 0) {
        this.lData = data;
        this.lData.forEach(item1 => {
          var d1 = {
            serialNo : this.j,
            orderDate: item1.orderDate,
            orderTime : item1.orderTime,
            tableNumber : item1.tableNo,
            total : item1.total + " €",
            orderId : item1.orderId
          }
          this.lastMonthData.push(d1);
          this.j++;
        })
      }
    })
  
    if(this.currentDate > 14) {
      this.api.getMonthDownloads(this.lastMonthCompare,this.barId).pipe(map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data => {
        this.oldRecordData = data
        if(data.length > 0) {
         
          this.api.getOrdersDetails(data[0].userOrderId).pipe(map((actions: any) => {
            return actions.map(a => {
              const data = a.payload.doc.data()
              const id = a.payload.doc.id;
              return { id, ...data };
            });
          })).subscribe(data => {
            data.forEach(d => {
              this.api.deleteOldOrders(d.orderId).then(deleted => {
            
              })
            })
          });
         
        }
        this.oldRecordData.forEach(old => {
          this.api.deleteOldUserOrders(old.userOrderId).then(deleted => {
         
          })
        })
      })
    }
  
  }
  month_name(dt){
    var mlist = [ "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember" ];
      return mlist[dt];
    };

    exportCurrent() {
      // var data = [
      //   {
      //     name: 'Test 1',
      //     age: 13,
      //     average: 8.2,
      //     approved: true,
      //     description: "using 'Content here, content here' "
      //   },
      //   {
      //     name: 'Test 2',
      //     age: 11,
      //     average: 8.2,
      //     approved: true,
      //     description: "using 'Content here, content here' "
      //   },
      //   {
      //     name: 'Test 4',
      //     age: 10,
      //     average: 8.2,
      //     approved: true,
      //     description: "using 'Content here, content here' "
      //   },
      // ];
       
      //   const options = { 
      //     fieldSeparator: ',',
      //     quoteStrings: '"',
      //     decimalseparator: '.',
      //     showLabels: true, 
      //     showTitle: true,
      //     title: 'My Awesome CSV',
      //     useBom: true,
      //     useKeysAsHeaders: true,
      //     // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
      //   };
       
      // const csvExporter = new ExportToCsv(options);
       
      // csvExporter.generateCsv(data);
      if(this.dataArray.length > 0) {
        const options = { 
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalseparator: '.',
          showLabels: true, 
          showTitle: false,
          title: this.todayDate,
          filename : this.todayDate,
          useBom: true,
          useKeysAsHeaders: true,
          // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
        };
       
      const csvExporter = new ExportToCsv(options);
       
      csvExporter.generateCsv(this.dataArray);
        setTimeout(() => {
        this.router.navigate(['/bar']);
      },2000 );
      } else {
        this.errorText = ""
        this.errorText = "Für diesen Monat gibt es noch keine aufgenommen Bestellungen."
      }
    }
    exportLast() {
      if(this.lastMonthData.length > 0) {
        const options = { 
          fieldSeparator: ',',
          quoteStrings: '"',
          decimalseparator: '.',
          showLabels: true, 
          showTitle: false,
          title: this.lastMonthDate,
          filename : this.lastMonthDate,
          useBom: true,
          useKeysAsHeaders: true,
          // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
        };
       
      const csvExporter = new ExportToCsv(options);
       
      csvExporter.generateCsv(this.lastMonthData);
     // this.xls.exportAsExcelFile(this.lastMonthData, this.lastMonthDate);
      setTimeout(() => {
        this.router.navigate(['/bar']);
      },2000 );
      } else {
        this.errorText = ""
        this.errorText = "Für diesen Monat gibt es noch keine aufgenommen Bestellungen."
      }
    }

}
