import { Component, OnInit, ViewChild } from '@angular/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/providers/api.service';
import { AuthService } from 'src/app/providers/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { map, finalize } from 'rxjs/operators';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { Ng2ImgMaxService } from 'ng2-img-max';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-create-bar',
  templateUrl: './create-bar.component.html',
  styleUrls: ['./create-bar.component.scss']
})
export class CreateBarComponent implements OnInit {

  uploadedImage: Blob;
  uploadedImageMultuple: Blob;
  @ViewChild("placesRef") placesRef: GooglePlaceDirective;
  public opmask = [  /\d/, /\d/, '.', /\d/, /\d/,'-', /\d/, /\d/,'.', /\d/, /\d/];
  bar_data = {
    barName: '',
    streethouse: '',
    lat_lng: '',
    phone: '',
    userId: '',
    city: '',
    barImage: '',
    barId : '',
    tables : '',
    status : 'active',
    wifiName : '',
    wifiPassword : ''
  };
  openingHoursData = {
    oh1: '',
    oh2: '',
    oh3: '',
    oh4: '',
    oh5: '',
    oh6: '',
    oh7: '',
    barId : ''
  };
  userId;
  loadingText = '';
  errorMessage = '';
  numOfBars;
  numOfImages;
  options;
  addedBars = "";
  fetchedData;
  barImages = {
    barId : '',
    imageName : '',
    imagePath : '',
    userId : '',
    imageId : ''
  };
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  downloadURL: Observable<string>;
  uploadState: Observable<string>;
  uploadProgress: Observable<number>;
  tests: Observable<any[]>;
  packageId;
  fname;
  accounts = false;
  lname; mail;
  
  public files: UploadFile[] = [];

  constructor(private api: ApiService, private auth: AuthService, private spinner: NgxSpinnerService, private router: Router,
    private afStorage: AngularFireStorage,private ng2ImgMax: Ng2ImgMaxService, private http : Http) {
    this.userId = JSON.parse(localStorage.getItem("data")).uid;
    this.numOfBars = JSON.parse(localStorage.getItem("data")).bars;
    this.numOfImages = JSON.parse(localStorage.getItem("data")).images;
    this.packageId = JSON.parse(localStorage.getItem("package")).packageId;
    this.fname = JSON.parse(localStorage.getItem("userInfo")).fname;
    this.lname = JSON.parse(localStorage.getItem("userInfo")).lname;
    this.mail = JSON.parse(localStorage.getItem("userInfo")).email;
    this.bar_data.userId = this.userId;
    this.barImages.userId = this.userId;
   
    if(this.auth.accountStatusDisable) {
      this.router.navigate(["/"]);
    }
    this.api.getUserBars(this.userId).pipe(map((actions : any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data=>{
      this.addedBars = data.length;
    });

  }
allDAta;
  ngOnInit() {
    this.api.getUser1(this.userId).pipe(map((actions : any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data=>{
  
      if(data[0].title == "" || data[0].title == "" || data[0].road == "" || data[0].zip == "" || data[0].city == "" 
      || data[0].housenumber == "")
      {
        this.errorMessage = ""
        this.errorMessage = "Bitte füll zunächst die Accountdetails komplett aus, um eine Bar hinzuzufügen."
        this.accounts = true
       
        // setTimeout(function(){ 
        //   this.router.navigate(['/account']);
        // }, 3000);

        
      }
    })
  }
  account(){
    this.router.navigate(['/account']);
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
   
   if(this.addedBars < this.numOfBars)
   {
        this.spinner.show();
        if (this.bar_data.barName != "" && this.bar_data.streethouse != "" && this.bar_data.phone != "" && this.bar_data.tables != "") {
          var barId = this.makeid();
          this.bar_data.barId = barId;
          this.openingHoursData.barId = barId;
          this.barImages.barId = barId;
        
          this.auth.saveLocalData(this.bar_data.barId,this.bar_data.barName);
          this.api.addUserBar(barId, this.bar_data).then(barAdded => {
            this.spinner.hide();
            this.api.addUserBarOpening(barId, this.openingHoursData).then(opening => {
              this.loadingText = "Deine Bar wurde erfolgreich erstellt!";
              var pack;
              if(this.packageId === "8n3g") {
                pack = "Pro";
              }
              if(this.packageId === "sk2b") {
                pack = "Free";
              }
              if(this.packageId === "gm8m") {
                pack = "Starter";
              }

              const formData = new FormData();
              formData.append('firstname', this.fname);
              formData.append('lastname', this.lname);
              formData.append('email', this.mail);
              formData.append('gender', "");
              formData.append('packagename', pack);
              formData.append('tables', this.bar_data.tables);
              formData.append('bName', this.bar_data.barName);
              formData.append('barId', barId);

              this.http.post('https://House of Mandi.de/api/api/barAdd', formData)
              .subscribe((data: Response) => {
                const response = data.json();
                if(response.status == "success") {
                  form.resetForm();
                }
              });
                
              setTimeout(() => {
               
                this.spinner.hide();
                this.errorMessage = "";
                    setTimeout(() => {
                  this.router.navigate(['/']);
                  }, 1000);
               
                // if(this.packageId === "wpyxDSMt35o6XiJ3cOGz") {
                //   this.auth.saveLocalData(barId,this.bar_data.barName);
                //   form.resetForm();
                //   setTimeout(() => {
                //   this.router.navigate(['/bar']);
                //   }, 2000);
                // } 
                // if(this.packageId === "Wv4hC2pbsjV7vZAF5YvT") {
                //   this.auth.saveLocalData(barId,this.bar_data.barName);
                //   form.resetForm();
                //   setTimeout(() => {
                //   this.router.navigate(['/bar/einstellungen']);
                //   },2000);
                // }
                // if(this.packageId === "WcZlsBjy0Zz3jLwW8DI3") {
                //   this.auth.saveLocalData(barId,this.bar_data.barName);
                //   form.resetForm();
                //   setTimeout(() => {
                //   this.router.navigate(['/bar/karten']);
                //   },2000);
                // }
              }, 1000);
              // this.api.addBarImages(this.barImages).then(add => {
             
              // })
              
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
      else
      {
        form.resetForm();
        this.errorMessage = "";
        this.errorMessage = "Du kannst maximal " +this.numOfBars+ " Bars erstellen. Du möchtest mehr Bars hinzufügen? Kontaktiere uns: info@House of Mandi.de";
      }
  }
  singleFile;
  uploadSingle(event) {
    this.spinner.show();
    this.singleFile = event.target.files[0];
    this.ng2ImgMax.compressImage(this.singleFile,0.20).subscribe(
      result => {
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
          this.bar_data.barId = JSON.parse(localStorage.getItem("bar")).barId;
          this.api.updateSingleBar(this.bar_data.barId, this.bar_data).then(updated => {
            this.loadingText = "Das Titelbild wurde erfolgreich hinzugefügt.";
            setTimeout(() => {
              this.spinner.hide();
              this.errorMessage = "";
              //this.router.navigate(['bar/einstellungen']);
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
  multipleFiles;
  uploadMultiple(event) {

      this.spinner.show();
      this.multipleFiles = event.target.files[0];
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
            this.barImages.barId = JSON.parse(localStorage.getItem("bar")).barId;
            this.api.addBarImages(this.barImages).then(ad => {
              this.loadingText = "Die Bilder wurden erfolgreich hinzugefügt.";

              this.spinner.hide();
              //this.router.navigate(['bar/einstellungen']);
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

  public dropped(event: UploadEvent) {
    this.files = event.files;
    
   
    this.files = event.files;
    for (const droppedFile of event.files) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

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
