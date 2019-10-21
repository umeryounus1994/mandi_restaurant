import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/providers/api.service';
import { AuthService } from 'src/app/providers/auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {
  barId;
  allTables=[]
  userId;
  tables=[]
  tableValues=[]
  downloadedValues=[]
  constructor(private api : ApiService, private auth : AuthService,private router : Router, private afs : AngularFirestore) {
    this.barId = JSON.parse(localStorage.getItem('bar')).barId;
    this.userId = JSON.parse(localStorage.getItem('data')).uid;
   }

  ngOnInit() {
    this.afs.collection('tables', ref=>ref.where('barId','==',this.barId)).snapshotChanges()
    .pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      this.downloadedValues=data;
      this.downloadedValues.sort(function(a, b){
        var nameA=a.tableNo, nameB=b.tableNo;
        if (nameA < nameB) //sort string ascending
         return -1;
        if (nameA > nameB)
         return 1;
        return 0; //default return value (no sorting)
       });
       if(this.downloadedValues.length > 0){
         this.downloadedValues.forEach((element)=> {
           this.tableValues.push(element.tableName)
         })
       }
      
      
    });
    this.api.getAllTables(this.barId).pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      if(data.length > 0) {
        this.tables = data[0].tables;

      for(var a : any =1; a <= this.tables; a++){

        const d = {
          "tableNo" : a,
          tableName : ""
        }
        if(this.downloadedValues.length < 1){
          this.tableValues.push(a)
        }
       
        this.allTables.push(d);
      }
      }
    })
   
  }

  onSubmit(form){
    if(this.downloadedValues.length < 1){
    var i=1;
    this.tableValues.forEach((element)=> {
        var d = {
          tableNo : i,
          tableName : element,
          barId : this.barId,
          tableId : this.makeid()
        }

        this.afs.doc('tables/'+d.tableId).set(d);
        i++;
    })

      history.back()
  } else {
    this.downloadedValues.forEach((element)=> {
      this.afs.doc('tables/'+element.tableId).delete();
    })
    var i=1;
    this.tableValues.forEach((element)=> {
        var d = {
          tableNo : i,
          tableName : element,
          barId : this.barId,
          tableId : this.makeid()
        }

        this.afs.doc('tables/'+d.tableId).set(d);
        i++;
    })

      history.back()
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
