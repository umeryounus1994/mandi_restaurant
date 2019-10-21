import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/providers/api.service';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/providers/auth.service';

@Component({
  selector: 'app-bar-accounts',
  templateUrl: './bar-accounts.component.html',
  styleUrls: ['./bar-accounts.component.scss']
})
export class BarAccountsComponent implements OnInit {

  userBars = [];
  barsCount;
  all =[];
  constructor(private auth : AuthService, private router : Router, private route : ActivatedRoute,private spinner : NgxSpinnerService,
    private api : ApiService) {
    var type = JSON.parse(localStorage.getItem('data')).accountType;
    if(type == "barowner")
      {
        this.router.navigate(['/']);
      }
   }

  ngOnInit() {
    this.api.getAllBars().pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      this.spinner.hide();
      this.userBars = data;
      this.all = this.userBars;
      this.barsCount = this.userBars.length;
    })
  }

  BarPage(barId,userId){
    this.router.navigate(['/admin/bars/bar',barId,userId])
  }


  onSearchChange(value : String) {
    // if(value != ""){
    //   this.userBars = [];
    
    //   this.api.getBarSearch(value).pipe(map((actions: any) => {
    //     return actions.map(a => {
    //       const data = a.payload.doc.data()
    //       const id = a.payload.doc.id;
    //       return { id, ...data };
    //     });
    //   })).subscribe(data => {
    //     this.userBars = data;
    
    //     this.barsCount = this.userBars.length;

    //   })
    // } else {
    //   this.barsCount = this.all.length;
    //   this.userBars = this.all;
    // }
    if(value === ''){
      this.userBars = this.all;
    }
    else{
      let y = value.toLowerCase();
      let x = this.all.filter(data => data.barName.toLowerCase().indexOf(y) > -1 || data.city.toLowerCase().indexOf(y)> -1)
        if(x.length> 0)
          this.userBars = x;
        else
          this.userBars = [];
    }
    }

}
