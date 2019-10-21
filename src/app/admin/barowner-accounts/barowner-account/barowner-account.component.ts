import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../providers/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/providers/api.service';
import { NgForm } from '@angular/forms';
import { map, take } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-barowner-account',
  templateUrl: './barowner-account.component.html',
  styleUrls: ['./barowner-account.component.scss']
})
export class BarownerAccountComponent implements OnInit {

  barUserId;
  account_data = {
    firstname: '',
    lastname: '',
    package : '',
    firm : '',
    title : 'mr',
    road : '',
    housenumber : '',
    zip : '',
    city : '',
    email : ''

  };
  update_package = {
    bars : '',
    images : '',
    users : '',
    packageId : '',
    userId : '',
    warningAt : '',
    expiresAt : '',
    status : '',
    packageName : '',
    price : ''
  }
  userData ;
  loadingText = "";
  bars;
  title;
  userPackage;
  packageName;
  userBars=[];
  oldPackageId='';
  day1;
  day2;
  month1;
  month2;
  errorMessage=""
  barStatus=""
  
  constructor(private auth : AuthService, private router : Router, private route : ActivatedRoute,private spinner : NgxSpinnerService,
    private api : ApiService,private afs: AngularFirestore) {
    this.route.params.subscribe(params => {
      this.barUserId = params['id']; 
   });
   this.update_package.userId = this.barUserId;

    var type = JSON.parse(localStorage.getItem('data')).accountType;
    if(type == "barowner") {
      this.router.navigate(['/']);
    }
      
   }

  ngOnInit() {
    this.spinner.show();
   this.api.getUser1(this.barUserId).pipe(map((actions: any) => {
    return actions.map(a => {
      const data = a.payload.doc.data()
      const id = a.payload.doc.id;
      return { id, ...data };
    });
  })).subscribe(data => {
      this.userData = data[0];
     
     
      this.spinner.hide();
      this.barStatus = this.userData.status
      this.account_data.firstname = this.userData.firstname;
      this.account_data.lastname = this.userData.lastname;
      this.account_data.firm = this.userData.firm;
      this.account_data.title = this.userData.title;
      this.account_data.road = this.userData.road;
      this.account_data.housenumber = this.userData.housenumber;
      this.account_data.zip = this.userData.zip;
      this.account_data.city = this.userData.city;
      this.account_data.email = this.userData.email;
      this.title = this.userData.title;
      
      
    })

    this.api.getUserPackage(this.barUserId).pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(pkg => {
      if(pkg.length > 0){
        this.userPackage = pkg[0];
        this.update_package.bars = this.userPackage.bars;
        this.update_package.images = this.userPackage.images;
        this.update_package.users = this.userPackage.users;
        this.update_package.packageId = this.userPackage.packageId;
        this.oldPackageId = this.userPackage.packageId;
        if(this.userPackage.packageId == '8n3g'){
          this.packageName = "Starter";
        } else if(this.userPackage.packageId == 'gm8m') {
          this.packageName = "Pro";
        }
      }
    

    });
    this.api.getUserBars(this.barUserId).pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      this.spinner.hide();
      this.userBars = data;
    })
  }

  onSubmit(form : NgForm) {
    this.api.updateUser(this.barUserId,this.account_data).then(updated => {
      this.loadingText = "";
      this.loadingText = "Updated Successfully...";
       this.router.navigate(['/admin']);

    })
  }
  getTitle(value) {
    this.account_data.title = value;
  }
  BarProfile(barId,userId) {
    this.router.navigate(['/admin/bars/bar',barId,userId]);
  }
  singlePackage;

  onSubmit1(form : NgForm) {
    if(this.update_package.packageId == this.oldPackageId){
    this.api.updatePackage(this.barUserId,this.update_package).then(updated => {
      this.loadingText = "";
      this.loadingText = "Updated Successfully...";
       this.router.navigate(['/admin']);
    })
  } else {
    this.api.getSinglePackage(this.update_package.packageId).subscribe(pkg =>{
      this.singlePackage = pkg;
      var date = new Date()
      var someDate = new Date();
      var numberOfDaysToAddWarning = 23;
      var numberOfDaysToAddExpiry = 31;
      someDate.setDate(someDate.getDate() + numberOfDaysToAddWarning); 
      var dd = someDate.getDate();
      if(dd < 10) {
        this.day1 = "0" + dd;
      } else {
        this.day1 = dd;
      }
      var mm = someDate.getMonth() + 1;
      if(mm < 10) {
        this.month1 = "0" + mm;
      } else {
        this.month1 = mm;
      }
      var y = someDate.getFullYear();


      date.setDate(date.getDate() + numberOfDaysToAddExpiry); 
      var ddd = date.getDate();
      if(ddd < 10) {
        this.day2 = +"0" + ddd
      } else {
        this.day2 = ddd;
      } 
      var mmm = date.getMonth() + 1
      if(mmm < 10) {
        this.month2 = "0" + mmm
      } else {
        this.month2 = mmm
      }
      var yy = date.getFullYear();

      var warningAt = this.month1 + '/'+ this.day1 + '/'+ y;
      var expiresAt = this.month2 + '/'+ this.day2 + '/'+ yy;
  
      this.update_package.bars = this.singlePackage.bars;
      this.update_package.images = this.singlePackage.images;
      this.update_package.users = this.singlePackage.users;
      this.update_package.packageId = this.update_package.packageId;
      this.update_package.warningAt = warningAt,
      this.update_package.expiresAt = expiresAt,
      this.update_package.status = "active",
      this.update_package.packageName = this.singlePackage.title,
      this.update_package.price = this.singlePackage.price
      this.api.updatePackage(this.barUserId,this.update_package).then(updated => {
        this.loadingText = "";
        this.loadingText = "Updated Successfully...";
         this.router.navigate(['/admin']);
      })
    })
  }
  }
  deleteBArs = [];
  delete() {
    var r = confirm("Are you sure you want to delete this bar owner?");
    if (r == true) {
      this.api.getUserBars(this.barUserId).pipe(take(1),map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data()
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data => {
        this.deleteBArs = data;
        if(this.deleteBArs.length > 0){
          for(var a =0; a < this.deleteBArs.length;a++) {
            var barId = this.deleteBArs[a].barId;
            this.api.getBarUsers(barId).pipe(map((actions: any) => {
              return actions.map(a => {
                const data = a.payload.doc.data()
                const id = a.payload.doc.id;
                return { id, ...data };
              });
            })).subscribe(data => {
              if(data.length>0){
                data.forEach(element => {
                  console.log('a')
                  this.api.deleteBarUser(element.userId).then();
              });
              }
            });
      
            this.api.getBarImages(barId).pipe(map((actions: any) => {
              return actions.map(a => {
                const data = a.payload.doc.data()
                const id = a.payload.doc.id;
                return { id, ...data };
              });
            })).subscribe(data => {
              if(data.length>0){
              data.forEach(element => {
                console.log('b')
                this.api.deleteBarImages(element.imageId).then();
            });
              }
            });
      
            this.api.getBarFavs(barId).pipe(map((actions: any) => {
              return actions.map(a => {
                const data = a.payload.doc.data()
                const id = a.payload.doc.id;
                return { id, ...data };
              });
            })).subscribe(data => {
              if(data.length>0){
              data.forEach(element => {
                console.log('c')
                this.api.deleteBarFavourites(element.deleteBarFavourites).then();
            });
          }
            });
      
            this.api.getBarCategoriess(barId).pipe(map((actions: any) => {
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
                    console.log('d')
                    this.api.deleteMenuItems(element.itemId).then();
                });
                });
              });
              data.forEach(element => {
                console.log('e')
                this.api.deleteCategory(element.categoryId).then();
            });
          }
            });
      
            
            this.api.getBarNewss(barId).pipe(map((actions: any) => {
              return actions.map(a => {
                const data = a.payload.doc.data()
                const id = a.payload.doc.id;
                return { id, ...data };
              });
            })).subscribe(data => {
              if(data.length>0){
              data.forEach(element => {
                console.log('f')
                this.api.deleteNews(element.newsId).then();
            });
          }
      
            });
      
            this.api.getBarTables(barId).pipe(map((actions: any) => {
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
      
      
            this.api.getAllUserOrderss(barId).pipe(map((actions: any) => {
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
      
            this.api.getAllOrderss(barId).pipe(map((actions: any) => {
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
            this.afs.doc('userbars/'+this.deleteBArs[a].barId).delete();
          }
        } else {
          this.afs.doc('users/'+this.barUserId).delete();
          this.router.navigate(['/admin']);
        }
      })
    }
     
  
  }

  blockBar(type){
    if(type=="block"){
      const data = {
        status: "disable"
      }
  
      var r = confirm("Are you sure you want to block this bar Owner?");
      if (r == true) {
        this.api.updateSingleAppUser(this.barUserId, data).then(userAdded => {
          this.loadingText=""
          this.loadingText = "Bar Owner has been blocked.";
          console.log(this.barUserId)
    
          this.router.navigate(['/admin'])
          //
        })
      }
    } else {
      const data = {
        status: "active"
      }
  
      var r = confirm("Are you sure you want to activate this bar Owner?");
      if (r == true) {
        this.api.updateSingleAppUser(this.barUserId, data).then(userAdded => {
          this.errorMessage=""
          this.loadingText = "Bar Owner has been activated.";
          this.router.navigate(['/admin'])
         
          //window.history.back()
        })
      }
    }
  }

}
