import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../providers/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/providers/api.service';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import { Ng2ImgMaxService } from 'ng2-img-max';

@Component({
  selector: 'app-bar-account',
  templateUrl: './bar-account.component.html',
  styleUrls: ['./bar-account.component.scss']
})
export class BarAccountComponent implements OnInit {

  uploadedImage: Blob;
  uploadedImageMultuple: Blob;
  barId;
  @ViewChild("placesRef") placesRef: GooglePlaceDirective;
  barInfo;
  openingHours;
  public opmask = [/\d/, /\d/, '.', /\d/, /\d/, '-', /\d/, /\d/, '.', /\d/, /\d/];
  bar_data = {
    barName: '',
    streethouse: '',
    lat_lng: '',
    phone: '',
    userId: '',
    city: '',
    barImage: '',
    barId: ''
  };
  openingHoursData = {
    oh1: '',
    oh2: '',
    oh3: '',
    oh4: '',
    oh5: '',
    oh6: '',
    oh7: '',
    barId: ''
  };
  loadingText = "";
  errorMessage = "";
  singleFile;
  multipleFiles;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  downloadURL: Observable<string>;
  uploadState: Observable<string>;
  uploadProgress: Observable<number>;
  tests: Observable<any[]>;
  barImages = {
    barId: '',
    imageName: '',
    imagePath: '',
    userId: '',
    imageId: '',
  };
  bImages = [];
  numofImages;
  barUserId;
  barStatus;
  constructor(private auth : AuthService, private router : Router,private api : ApiService,private route:ActivatedRoute
    , private spinner: NgxSpinnerService, private afStorage: AngularFireStorage,private ng2ImgMax: Ng2ImgMaxService) {
    this.route.params.subscribe(params => {
      this.barId = params['id']; 
      this.barUserId = params['id1'];
   });
   this.bar_data.userId = this.barUserId;
   this.barImages.barId = this.barId;
   this.barImages.userId = this.barUserId;
    var type = JSON.parse(localStorage.getItem('data')).accountType;
    if(type == "barowner")
      {
        this.router.navigate(['/']);
      }
   }

  ngOnInit() {
    this.spinner.show();
    this.api.getSingleBar(this.barId).subscribe(data => {
      this.barInfo = data;
      this.bar_data.barName = this.barInfo.barName;
      this.bar_data.streethouse = this.barInfo.streethouse;
      this.bar_data.phone = this.barInfo.phone;
      this.bar_data.city = this.barInfo.city;
      this.bar_data.lat_lng = this.barInfo.lat_lng;
      this.bar_data.barImage = this.barInfo.barImage;
      this.barStatus=this.barInfo.status
    })
    this.api.getSingleBarOpeningHours(this.barId).subscribe(data1 => {
      
      this.openingHours = data1;
      this.openingHoursData.oh1 = this.openingHours.oh1;
      this.openingHoursData.oh2 = this.openingHours.oh2;
      this.openingHoursData.oh3 = this.openingHours.oh3;
      this.openingHoursData.oh4 = this.openingHours.oh4;
      this.openingHoursData.oh5 = this.openingHours.oh5;
      this.openingHoursData.oh6 = this.openingHours.oh6;
      this.openingHoursData.oh7 = this.openingHours.oh7;

    })
    this.api.getBarsImages(this.barId).pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      this.spinner.hide();
      this.bImages = data;
      this.numofImages = data.length;
    });
  }
  public handleAddressChange(address: Address) {
    var lat = JSON.stringify(address.geometry.location.lat());
    var lng = JSON.stringify(address.geometry.location.lng());
    this.bar_data.lat_lng = lat + "," + lng;
    this.bar_data.streethouse = address.formatted_address;
    this.bar_data.city = address.vicinity;
  }

  onSubmit(form: NgForm) {

    this.spinner.show();
    if (this.bar_data.barName != "" || this.bar_data.streethouse != "" || this.bar_data.phone != "") {
      this.bar_data.barId = this.barId;
      this.openingHoursData.barId = this.barId;
      this.api.updateSingleBar(this.barId, this.bar_data).then(barAdded => {
        this.spinner.hide();
        this.api.updatSingleBarOpeningHours(this.barId, this.openingHoursData).then(opening => {
          this.loadingText = "Bar Edited Successfully Successfully. Redirecting Now...!!!";
          this.spinner.hide();
          setTimeout(() => {
           
            this.errorMessage = "";
            this.router.navigate(['/admin/bars']);
          }, 3000);


        })
      })

    }
    else {
      this.spinner.hide();
      this.loadingText = "";
      this.errorMessage = "";
      this.errorMessage = "Please fill in all fields";
    }
  }

  uploadSingle(event) {
    this.spinner.show();
    this.singleFile = event.target.files[0];
    this.ng2ImgMax.compressImage(this.singleFile,0.20).subscribe(
      result => {
        //console.log(result);
        this.uploadedImage = new File([result], result.name);
    const id = Math.random().toString(36).substring(2);
    const ref = this.afStorage.ref(id);
    this.task = ref.put(this.singleFile);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      finalize(() => {
        ref.getDownloadURL().subscribe(sub => {
          var data = sub;
          this.bar_data.barImage = data;
          this.bar_data.barId = this.barId;
          this.api.updateSingleBar(this.barId, this.bar_data).then(updated => {
            this.loadingText = "Bar Edited Successfully Successfully. Redirecting Now...!!!";
            setTimeout(() => {
              this.spinner.hide();
              this.errorMessage = "";
              
            }, 2000);
          })

        })
      })
    )
      .subscribe()
    },
    error => {
      this.spinner.hide();
      this.errorMessage = ""
      this.errorMessage = error;
      console.log('😢 Oh no!', error);
    }
  );
  }

  uploadMultiple(event) {
   
   // if (this.numofImages + 1 <= JSON.parse(localStorage.getItem('data')).images) {
      this.spinner.show();
      this.multipleFiles = event.target.files[0];
      this.ng2ImgMax.compressImage(this.multipleFiles,0.20).subscribe(
        result => {
          this.uploadedImageMultuple = new File([result], result.name);
      const id = Math.random().toString(36).substring(2);
      const ref = this.afStorage.ref(id);
      this.task = ref.put(this.multipleFiles);
      this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
      this.uploadProgress = this.task.percentageChanges();
      this.task.snapshotChanges().pipe(
        finalize(() => {
          ref.getDownloadURL().subscribe(sub => {
            var data = sub;
            this.barImages.imagePath = data;
            this.barImages.imageId = this.makeid();
            this.api.addBarImages(this.barImages).then(ad => {

              this.spinner.hide();
              //location.reload();
            })
          })
        })
      )
        .subscribe()
      },
      error => {
        this.spinner.hide();
        this.errorMessage = ""
        this.errorMessage = error;
        console.log('😢 Oh no!', error);
      }
    );
    // }
    // else {
    //   this.errorMessage = "";
    //   this.errorMessage = "Num of images can not be more than " + JSON.parse(localStorage.getItem('data')).images;
    // }
  }
  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 20; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
  deleteImage(imageId) {
    this.api.deleteBarImages(imageId).then(updated => {
    })
  }

  // deleteBar() {
  //   var data = {
  //     status : "disable",
  //     barId : this.barId
  //   };

  //         this.api.deleteBar(data).then(d => {
  //           this.loadingText = "";
  //           this.loadingText = "Bar has been deleted..";
  //           setTimeout(function(){ 
  //             this.router.navigate(['/admin/bars']);
  //           }, 3000);
  //         })
  // }

  blockBar(type){
    if(type=="block"){
      const data = {
        status: "disable"
      }
  
      var r = confirm("Are you sure you want to block this bar?");
      if (r == true) {
        this.api.updateSingleBar(this.barId, data).then(userAdded => {
          this.loadingText=""
          this.errorMessage = "Bar has been blocked.";
        })
      }
    } else {
      const data = {
        status: "active"
      }
  
      var r = confirm("Are you sure you want to activate this bar?");
      if (r == true) {
        this.api.updateSingleBar(this.barId, data).then(userAdded => {
          this.errorMessage=""
          this.loadingText = "Bar has been activated.";
        })
      }
    }
  }

  deleteBar(){
    var r = confirm("Are you sure you want to delete this bar and all its data?");
    if (r == true) {
      this.api.getBarUsers(this.barId).pipe(map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data => {
       
        if(data.length>0){
          data.forEach(element => {
            // console.log('a')
            this.api.deleteBarUser(element.userId).then();
        });
        }
      });

      this.api.getBarImages(this.barId).pipe(map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data => {
        if(data.length>0){
        data.forEach(element => {
          // console.log('b')
          this.api.deleteBarImages(element.imageId).then();
      });
        }
      });

      this.api.getBarFavs(this.barId).pipe(map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data => {
        if(data.length>0){
        data.forEach(element => {
          // console.log('c')
          this.api.deleteBarFavourites(element.deleteBarFavourites).then();
      });
    }
      });

      this.api.getBarCategoriess(this.barId).pipe(map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data => {
        
        if(data.length>0){
        data.forEach(element => {
          this.api.getBarMenuItemss(element.categoryId).pipe(map((actions: any) => {
            return actions.map(a => {
              const data = a.payload.doc.data()
              const id = a.payload.doc.id;
              return { id, ...data };
            });
          })).subscribe(data1 => {
            data1.forEach(element => {
              // console.log('d')
              this.api.deleteMenuItems(element.itemId).then();
          });
          });
        
    
        });
      

        data.forEach(element => {
          // console.log('e')
          this.api.deleteCategory(element.categoryId).then();
      });
    }

      });

      
      this.api.getBarNewss(this.barId).pipe(map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data => {
        if(data.length>0){
        data.forEach(element => {
          // console.log('f')
          this.api.deleteNews(element.newsId).then();
      });
    }

      });

      this.api.getBarTables(this.barId).pipe(map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data => {
        if(data.length>0){
        data.forEach(element => {
          this.api.deleteBarTable(element.tableId).then();
      });
    }

      });


      this.api.getAllUserOrderss(this.barId).pipe(map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data => {
        if(data.length>0){
        data.forEach(element => {
          this.api.deleteUserOrders(element.userOrderId).then();
      });
    }


      });

      this.api.getAllOrderss(this.barId).pipe(map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(orderData => {
        if(orderData.length>0){
    
        orderData.forEach(element => {
          this.api.getAllOrderDetails(element.orderId).pipe(map((actions: any) => {
            return actions.map(a => {
              const data = a.payload.doc.data()
              const id = a.payload.doc.id;
              return { id, ...data };
            });
          })).subscribe(orderDataDetails => {
            orderDataDetails.forEach(element => {
              this.api.deleteOrderDetails(element.orderDetailId).then();
          });

          })
        });

        orderData.forEach(element => {
          this.api.deleteOrder(element.orderId).then();
      });
    }


      });
     
      this.api.deletesingleBar(this.barId).then();
     this.router.navigate(['/admin'])
    }
  }

}
