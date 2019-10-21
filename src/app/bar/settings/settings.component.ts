import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { ApiService } from 'src/app/providers/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  uploadedImage: Blob;
  uploadedImageMultuple: Blob;
  @ViewChild("placesRef") placesRef: GooglePlaceDirective;
  barInfo;
  openingHours;
  barId;
  public opmask = [/\d/, /\d/, '.', /\d/, /\d/, '-', /\d/, /\d/, '.', /\d/, /\d/];
  bar_data = {
    barName: '',
    streethouse: '',
    lat_lng: '',
    phone: '',
    userId: '',
    city: '',
    barImage: '',
    barId: '',
    wifiName : '',
    wifiPassword : '',
    tables:''
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
  barName = "";

  public files: UploadFile[] = [];
  constructor(private auth: AuthService, private api: ApiService, private spinner: NgxSpinnerService, private router: Router,
    private afStorage: AngularFireStorage,private ng2ImgMax: Ng2ImgMaxService) {
      
    this.barId = JSON.parse(localStorage.getItem('bar')).barId;
    this.bar_data.userId = JSON.parse(localStorage.getItem('data')).uid;
    this.barImages.barId = this.barId;
    this.barImages.userId = JSON.parse(localStorage.getItem("data")).uid;
    if(this.auth.accountStatusDisable) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
    this.barName = JSON.parse(localStorage.getItem("bar")).barName;

    this.spinner.show();
    this.api.getSingleBar(this.barId).subscribe(data => {
      this.barInfo = data;
      this.bar_data.barName = this.barInfo.barName;
      this.bar_data.streethouse = this.barInfo.streethouse;
      this.bar_data.phone = this.barInfo.phone;
      this.bar_data.city = this.barInfo.city;
      this.bar_data.lat_lng = this.barInfo.lat_lng;
      this.bar_data.barImage = this.barInfo.barImage;
      this.bar_data.wifiName=this.barInfo.wifiName;
      this.bar_data.wifiPassword=this.barInfo.wifiPassword;
      this.bar_data.tables=this.barInfo.tables
    })
    this.api.getSingleBarOpeningHours(this.barId).subscribe(data1 => {
      this.spinner.hide();
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
    var n =this.bar_data.barName[0].toUpperCase() + this.bar_data.barName.slice(1);
    this.bar_data.barName = ""
    this.bar_data.barName = n
    this.spinner.show();
    if (this.bar_data.barName != "" || this.bar_data.streethouse != "" || this.bar_data.phone != "") {
      this.bar_data.barId = this.barId;
      this.openingHoursData.barId = this.barId;
      this.api.updateSingleBar(this.barId, this.bar_data).then(barAdded => {
        this.spinner.hide();
        this.api.updatSingleBarOpeningHours(this.barId, this.openingHoursData).then(opening => {
          this.loadingText = "Deine Bardetails wurden erfolgreich geändert!";
          setTimeout(() => {
            this.spinner.hide();
            this.errorMessage = "";
            //this.router.navigate(['/']);
          }, 2000);


        })
      })

    }
    else {
      this.spinner.hide();
      this.loadingText = "";
      this.errorMessage = "";
      this.errorMessage = "Bitte füll alle notwendigen Felder aus!";
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
        this.task = ref.put(this.uploadedImage);
        this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
        this.uploadProgress = this.task.percentageChanges();
        this.task.snapshotChanges().pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe(sub => {
              var data = sub;
              this.bar_data.barImage = data;
              this.bar_data.barId = this.barId;
              this.api.updateSingleBar(this.barId, this.bar_data).then(updated => {
                this.loadingText = "Deine Bardetails wurden erfolgreich geändert!";
                setTimeout(() => {
                  this.spinner.hide();
                  this.errorMessage = "";
                  //location.reload();
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

  navigateTables() {
    this.router.navigate(['/bar/einstellungen/tische']);
  }

  navigateServices() {
    this.router.navigate(['/bar/einstellungen/services']);
  }

   
  public dropped(event: UploadEvent) {
    this.files = event.files;
    
   
    this.files = event.files;
    for (const droppedFile of event.files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          if (this.numofImages + 1 <= JSON.parse(localStorage.getItem('data')).images) {
            this.spinner.show();
            this.multipleFiles = file;
            this.ng2ImgMax.compressImage(this.multipleFiles,0.20).subscribe(
              result => {
                this.uploadedImageMultuple = new File([result], result.name);
                const id = Math.random().toString(36).substring(2);
                const ref = this.afStorage.ref(id);
                this.task = ref.put(this.uploadedImageMultuple);
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
          else {
            this.errorMessage = "";
            this.errorMessage = "Die maximale Anzahl an Bilder, die du hochladen darfst, lautet: " + JSON.parse(localStorage.getItem('data')).images;
          }
       

        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
       
      }
    }
    return false;

  }
  public fileOver(event){
    console.log(event);
  }
 
  public fileLeave(event){
    console.log(event);
  }
}