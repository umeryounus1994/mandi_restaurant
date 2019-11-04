import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { ApiService } from 'src/app/providers/api.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { Ng2ImgMaxService } from 'ng2-img-max';
declare var $ :any;
@Component({
  selector: 'app-edit-shisha-item',
  templateUrl: './edit-shisha-item.component.html',
  styleUrls: ['./edit-shisha-item.component.scss']
})
export class EditShishaItemComponent implements OnInit {

  itemId = "";
  menu_item = {
    itemName : "",
    price : "",
    make : "",
    categoryId : "",
    categoryName : "",
    status : "",
    itemImage : '',
    description:''


  }
  categories = [];
  barId = "";
  loadingText = "";
  cId;
  makee = "";
  uploadedImage: Blob;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  downloadURL: Observable<string>;
  uploadState: Observable<string>;
  uploadProgress: Observable<number>;
  tests: Observable<any[]>;
  singleFile;
  spinnerText = '';
  errorMessage= '';
  constructor(public auth : AuthService,
    private afs: AngularFirestore,
    public api : ApiService, public router : Router,private spinner: NgxSpinnerService,
    private afStorage: AngularFireStorage,private ng2ImgMax: Ng2ImgMaxService) { 
   
    this.itemId = JSON.parse(localStorage.getItem("item")).itemId;

  }
  
    ngOnInit() {
      this.spinner.show();
      this.afs.collection('menuitems', ref=>ref.where('itemId','==',this.itemId)).snapshotChanges().pipe(map((actions : any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data=>{
        this.spinner.hide();
   
         this.menu_item.itemName = data[0].itemName;
       
         this.menu_item.price = data[0].price;
         this.menu_item.make = data[0].make;
         this.menu_item.categoryId = data[0].categoryId;
         this.menu_item.categoryName = data[0].categoryName;
         this.menu_item.itemImage = data[0].itemImage;
         this.menu_item.description = data[0].description;
         this.cId = data[0].categoryId+","+data[0].categoryName;
         this.menu_item.status = data[0].status;
       
         this.makee = data[0].make;
      })
      this.afs.collection('categories', ref=>ref.where('page','==','breakfast')).snapshotChanges().pipe(map((actions : any) => {
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
  changeStatus(st) {
    let data = {
      status : st
    };
    this.api.updateMenuItem(this.itemId,data).then(added => {
      this.router.navigate(['/bar/karten/breakfast']);
      setTimeout(() => {
      }, 1000);
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
    this.api.updateMenuItem(this.itemId,this.menu_item).then(added => {
      this.loadingText = "Menu Item updated successfully"
      this.router.navigate(['/bar/karten/breakfast']);
      setTimeout(() => {
      
        //this.router.navigate(['/bar/karten/shisha']);
      }, 1000);
    })
  } else {
    this.afs.collection('menuitems', ref=>ref.where("page",'==','breakfast').where("make","==","yes")).snapshotChanges().pipe(map((actions : any) => {
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
          this.loadingText = "Updated successfully";
          this.router.navigate(['/bar/karten/breakfast']);
        })
      }) 
      this.i++;
    } else {
     
      if(this.i == 0)
      {
      this.api.updateMenuItem(this.itemId,this.menu_item).then(up => {
        this.loadingText = "Updated successfully";
        this.router.navigate(['/bar/karten/breakfast']);
      })
    }
    this.i++;
    }
 
        let data1 = {
              make : "no"
                 };
        this.api.updateMenuItem(this.allitems[0].id, data1).then(updated => {
          this.api.updateMenuItem(this.itemId,this.menu_item).then(up => {
            this.loadingText = "Updated successfully";
            this.router.navigate(['/bar/karten/breakfast']);
          })

        })
  })
  
  }
  }

  makeToday(today) {
    this.menu_item.make = today;
  }
  deleteItem() {
    this.api.deleteMenuItems(this.itemId).then(deleted => {
      this.router.navigate(['/bar/karten/breakfast']);
    })
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
