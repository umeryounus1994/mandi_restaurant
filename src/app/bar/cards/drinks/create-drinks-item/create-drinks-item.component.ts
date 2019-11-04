import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { ApiService } from 'src/app/providers/api.service';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { Ng2ImgMaxService } from 'ng2-img-max';
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
    userId : "",
    categoryId : "",
    page : "lunch",
    make : "no",
    itemId : "",
    status : "active",
    description: '',
    itemImage: ''
  };
  accountType='';
  loadingText = '';
  singleFile;
  errorMessage = '';
  uploadedImage: Blob;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  downloadURL: Observable<string>;
  uploadState: Observable<string>;
  uploadProgress: Observable<number>;
  tests: Observable<any[]>;
  spinnerText=''
  constructor(public auth : AuthService, public api : ApiService, private spinner : NgxSpinnerService, private router : Router,
    private afs: AngularFirestore,private afStorage: AngularFireStorage,private ng2ImgMax: Ng2ImgMaxService) {
    this.menu_item.userId = JSON.parse(localStorage.getItem("data")).uid;
    this.accountType = JSON.parse(localStorage.getItem('data')).accountType;

   }

   ngOnInit() {
    this.menu_item.itemId = this.auth.makeid();
    this.afs.collection('categories', ref=>ref.where('page','==','lunch')).snapshotChanges().pipe(map((actions : any) => {
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
    this.api.addMenuItem(this.menu_item).then(added => {
      
      this.loadingText = "Adding Menu item"
      setTimeout(() => {
        
        this.router.navigate(['/bar/karten/lunch']);
      }, 1000);
    })
  } else {
    this.afs.collection('menuitems', ref=>ref.where("page",'==','lunch').where("make","==","yes")).snapshotChanges().pipe(map((actions : any) => {
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
          this.loadingText = "Menu Item Added Successfully";
          this.router.navigate(['/bar/karten/lunch']);
        })
      }) 
      this.i++;
    } else {
     
      if(this.i == 0)
      {
        this.api.addMenuItem(this.menu_item).then(added => {
          this.loadingText = "Menu Item Added Successfully";
        this.router.navigate(['/bar/karten/lunch']);
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
   uploadSingle(event) {
    this.spinner.show();
    this.spinnerText = '';
    this.spinnerText='Uploading Image';
  this.singleFile = event.target.files[0];
  this.ng2ImgMax.compressImage(this.singleFile,0.20).subscribe(
    result => {
      //console.log(result);
      this.uploadedImage = new File([result], result.name);
      const id = Math.random().toString(36).substring(2);
      const ref = this.afStorage.ref(id);
      this.task = ref.put(this.uploadedImage);
      this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
      this.uploadProgress = this.task.percentageChanges();
      this.task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(sub => {
            var data = sub;
            this.menu_item.itemImage = data;
            this.spinner.hide();
          })
        })
      )
        .subscribe()
    },
    error => {
      
      this.errorMessage = ""
      this.errorMessage = error;
      console.log('😢 Oh no!', error);
    }
  );

}

}
