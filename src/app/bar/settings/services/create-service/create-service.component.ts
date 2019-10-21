import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/providers/api.service';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.scss']
})
export class CreateServiceComponent implements OnInit {
  serviceName="kellner";
  barId;
  showInput=false;
  constructor(private api : ApiService) {
    this.barId = JSON.parse(localStorage.getItem('bar')).barId;
   }

  ngOnInit() {
  }

  saveService(serviceName){
    if(serviceName == "Sonstiges"){
      this.serviceName=""
      this.showInput=true;
    } else {
      this.serviceName = serviceName;
    }
  }

  add(){
    const data = {
      barId : this.barId,
      service : this.serviceName,
      serviceId : this.makeid()
    }
    console.log(data)
    this.api.addService(data.serviceId,data).then(added=>{
      window.history.back()
    })
  }
  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 25; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
}
