import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  //public data:any=[]
  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService) { }
  saveInLocal(key, val) {
   var result = this.getFromLocal(key)

      if (result) {
        result.push(val);
        return this.storage.set(key, val);
      }
      else {
        return this.storage.set(key, val);
      }
   
  }

   getFromLocal(key) {

   return this.storage.get(key);
   
   }
}
