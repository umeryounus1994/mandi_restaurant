import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { ApiService } from 'src/app/providers/api.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements OnInit {
  appUserId;
  userData = {
    firstName: '',
    lastName: '',
    title: '',
    birthDate: ''
  };
  userEmail;
  userInfo;
  loadingText = '';
  errorMessage = '';
  userStatus;
  constructor(private auth: AuthService, private api: ApiService, private router: Router, private spinner: NgxSpinnerService) {
    this.appUserId = JSON.parse(localStorage.getItem('appUserId')).appUserId;
    let type = JSON.parse(localStorage.getItem('data')).accountType;
    if (type == 'barowner') {
      this.router.navigate(['/']);
    }

  }

  ngOnInit() {
    this.spinner.show();
    this.api.getSingleAppUser(this.appUserId).subscribe(data => {
      
      this.userInfo = data;
      if(!this.userInfo){
        this.router.navigate(['/admin']);
        return;
      }
      // console.log(this.userInfo);
      // debugger;
      if(this.userInfo.hasOwnProperty('firstname'))
         this.userData.firstName = this.userInfo.firstname;
      if (this.userInfo.firstname == undefined) {
        this.userInfo.firstname = '';
        this.router.navigate(['/admin']);
      }
      this.userData.lastName = this.userInfo.lastname;
      this.userData.title = this.userInfo.gender;
      this.userData.birthDate = this.userInfo.dob;
      this.userEmail = this.userInfo.email;
      this.userStatus = this.userInfo.status;
      this.spinner.hide();

    });
  }

  onSubmit(form) {
    this.spinner.show();
    if (this.userData.firstName != '' || this.userData.lastName != '' || this.userData.title != '' || this.userData.birthDate) {
      const data = {
        firstname: this.userData.firstName,
        lastname: this.userData.lastName,
        gender: this.userData.title,
        dob: this.userData.birthDate
      };
      this.api.updateSingleAppUser(this.appUserId, data).then(userAdded => {
        this.spinner.hide();
        this.loadingText = 'User Edited Successfully Successfully.';
      });
    } else {
      this.spinner.hide();
      this.loadingText = '';
      this.errorMessage = '';
      this.errorMessage = 'Please fill in all fields';
    }
  }

  blockUser(type) {
    if (type == 'block') {
      const data = {
        status: 'disable'
      };

      let r = confirm('Are you sure you want to block this user?');
      if (r == true) {
        this.api.updateSingleAppUser(this.appUserId, data).then(userAdded => {
          this.loadingText = ''
          this.errorMessage = 'User has been blocked.';
        });
      }
    } else {
      const data = {
        status: 'active'
      };

      let r = confirm('Are you sure you want to activate this user?');
      if (r == true) {
        this.api.updateSingleAppUser(this.appUserId, data).then(userAdded => {
          this.errorMessage = ''
          this.loadingText = 'User has been activated.';
        });
      }
    }

  }

  deleteUser() {

    if (confirm('Are you sure you want to delete this user?')) {

      this.api.getBarFavourites(this.appUserId).pipe(map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };

        });
      })).subscribe(data => {
        // console.log('Get bar Favourites subscribe \n' + data);

        data.forEach(element => {
          // console.log('Get bar Favourites \n' + element.userOrderId);

          this.api.deleteUserOrders(element.userOrderId).then(deleted => {
            // console.log('User Order deleted \n' + deleted);

          });
        });
      });
      this.api.getAllUserOrders(this.appUserId).pipe(map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })).subscribe(data => {
        // console.log('User all Orders \n' + data);

        data.forEach(element => {
          this.api.deleteUserOrders(element.userOrderId).then(deleted => {
            // console.log('User all Orders deleted \n' + deleted);

          });
        });
      });

      this.api.getAllOrders(this.appUserId).pipe(map((actions: any) => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };

        });
      })).subscribe(orders => {
        // console.log(' all Orders  \n' + orders);

        orders.forEach(element => {
          this.api.getAllOrderDetails(element.orderId).pipe(map((actions: any) => {
            return actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return { id, ...data };
            });
          })).subscribe(orderDetails => {

            orderDetails.forEach(element => {
              this.api.deleteOrderDetails(element.orderDetailId).then(deleted => {
              });
            });
          });
        });
        orders.forEach(element => {
          this.api.deleteOrder(element.orderId).then(deleted => {
            // console.log('eleteOrder sexfully \n' + deleted);

          });
        });
      });

      this.api.deleteAppUser(this.appUserId).then(deleted => {
        // console.log('User deleted sexfully \n' + deleted);
        this.router.navigate(['/admin/users']);
      });

    }
  }

}
