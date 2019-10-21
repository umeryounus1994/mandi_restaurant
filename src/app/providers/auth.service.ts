import { ApiService } from 'src/app/providers/api.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  packageDetails;
  userId;
  currentDAte;
  month;
  days;
  expiryNotification = false;
  warningNotification = false;
  dateExpired;
  packagePrice;
  accountStatusDisable = false
  accountType;
  cartData=[]
  constructor(private afAuth:AngularFireAuth, private api : ApiService, private router : Router) {
  
    if(this.getLocalTokens() != null){
  } else {
    this.router.navigate(['/login']);
  }
}

  /*--------------- Admin Auth----------------*/
  adminLogin(email,password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email,password);
  } 

  adminRegister(email,password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email,password);
  }


  // Auth
   //TOKEN 
   getAuthToken(){
    let token=localStorage.getItem('token');
  return  this.afAuth.auth.signInAndRetrieveDataWithCustomToken(token);
  }

  saveLocalTokens(uid){
    let data = {
      "uid":uid}; 
    localStorage.setItem('data',JSON.stringify(data));
  }
  saveInfo(email) {
    let data = {
      "email":email}; 
    localStorage.setItem('userInfo',JSON.stringify(data));
  }
  getLocalTokens(){
    return JSON.parse(localStorage.getItem('data'));
  }
  clearLocalTokens(){
    return localStorage.removeItem('data');
  }

  saveLocalData(barId,barName) {
    let b = { "barId" : barId, "barName" : barName };
    localStorage.setItem("bar", JSON.stringify(b));
  }
  saveOrderId(orderId,orderedBy) {
    let o = { "orderId" : orderId,"orderedBy":orderedBy};
    localStorage.setItem("order", JSON.stringify(o));
  }

  saveCategoryId(categoryId) {
  let c = { "categoryId" : categoryId };
    localStorage.setItem("category", JSON.stringify(c));
  }
  clearCategoryId(){
    return localStorage.removeItem('category');
  }
  saveMenuItem(itemId) {
    let i = { "itemId" : itemId };
    localStorage.setItem("item", JSON.stringify(i));
  } 
  saveNewsId(newsId) {
    let n = { "newsId" : newsId };
    localStorage.setItem("news", JSON.stringify(n));
  } 
  saveEmails(email) {
    let e = { "email" : email };
    localStorage.setItem("email", JSON.stringify(e));
  }
  clearEmails() {
    return localStorage.removeItem('email');
  }
  savePayment(payment) {
    let p = { "payment" : payment };
    localStorage.setItem("payment", JSON.stringify(p));
  }
  savePaymentStatus(status) {
    let e = { "status" : status };
    localStorage.setItem("status", JSON.stringify(e));
  }
  clearPaymentStatus(){
    return localStorage.removeItem('status');
  }
  savePackage(packageId) {
    let e = { "packageId" : packageId };
    localStorage.setItem("package", JSON.stringify(e));
  }
  saveCartData(cartData,array) {
    if(array == "array") {
      
      let c = { "cart" : cartData }
      localStorage.setItem("cart", JSON.stringify(c));
    } else {
      this.cartData.push(cartData)
      let c = { "cart" : this.cartData }
      localStorage.setItem("cart", JSON.stringify(c));
    }
  }

  saveAppUserId(userId){
    let u = { "appUserId" : userId};
    localStorage.setItem("appUserId", JSON.stringify(u));
  }

  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 20; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }


}
