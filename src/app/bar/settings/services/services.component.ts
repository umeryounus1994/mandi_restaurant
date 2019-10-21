import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/providers/api.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  allServices=[]
  barId
  constructor(private router: Router,private api : ApiService) {
    this.barId = JSON.parse(localStorage.getItem('bar')).barId;
   }

  ngOnInit() {
    this.api.getServices(this.barId).pipe(map((actions: any) => {
      return actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })).subscribe(data => {
      this.allServices=data

    });
  }

  navigateCreateService() {
    this.router.navigate(['/bar/einstellungen/services/erstellen']);
  }

  delete(serviceId){
    this.api.deleteService(serviceId).then();
  }

}
