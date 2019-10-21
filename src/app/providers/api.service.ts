import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  user;
  constructor(private afs:AngularFirestore, private afStorage:AngularFireStorage) { }

  /*------------- General Functions *---------------*/
  getPackages() {
    return this.afs.collection('packages',ref=> ref.orderBy("price","asc")).snapshotChanges();
  }

   /*-------------  Functions *---------------*/
  addUser(id, data){
    return this.afs.doc('users/'+id).set(data);
  }
  getUser(id){
    
    return this.afs.doc('users/'+id).snapshotChanges();
  }
  getUser1(id){
    return this.afs.collection('users', ref=>ref.where('userId','==',id)).snapshotChanges();
  }
  updateUser(userId, data) {
    return this.afs.doc('users/'+userId).update(data);
  }
  updateNewsStatus(newsId, data) {
    return this.afs.doc('newsStatus/'+newsId).update(data);
  }
  updatePackage(userId, data) {
    return this.afs.doc('user_packages/'+userId).update(data);
  }
  deleteUser(userId,data) {
    return this.afs.doc('users/'+userId).update(data);
  }
  addBarImages(data) {
    return this.afs.doc('barImages/'+data.imageId).set(data);
  }
  getBarsImages(barId) {
    return this.afs.collection('barImages', ref=>ref.where('barId','==',barId)).snapshotChanges();
  }
  getBar(barId){
    return this.afs.collection('userbars', ref=>ref.where('barId','==',barId)).snapshotChanges();
  }
  deleteBarImages(imageId){
    return this.afs.doc('barImages/'+imageId).delete();
  }
  updateBarImages(barId,data){
    return this.afs.doc('barImages/'+barId).update(data);
  }
  updatePackageDataUser(packageId,data) {
    return this.afs.doc('user_packages/'+packageId).update(data);
  }

  addUserPackage(id, data) {
    return this.afs.doc('user_packages/'+id).set(data);
  }
  getUserPackage(id) {
    return this.afs.collection('user_packages', ref=>ref.where('userId','==',id)).snapshotChanges();
    //return this.afs.doc('user_packages/'+id).valueChanges();
  }
  getUserBarsAndImages(packageId) {
    return this.afs.collection('packages', ref=>ref.where('packageId','==',packageId)).snapshotChanges();
  }
  getSinglePackage(packageId) {
    return this.afs.doc('packages/'+packageId).valueChanges();
  }
  getUserBars(userId) {
    return this.afs.collection('userbars', ref=>ref.where('userId','==',userId)).snapshotChanges();
  }
  addUserBar(barId,data) {
    return this.afs.doc('userbars/'+barId).set(data);
  }
  addUserBarOpening(barId,data) {
    return this.afs.doc('bar_openinghours/'+barId).set(data);
  }
  addCategory(data) {
    return this.afs.doc('categories/'+data.categoryId).set(data);
  }
  getBarCategories(barId, page) {
    return this.afs.collection('categories', ref=>ref.where('barId','==',barId).where('page','==',page)).snapshotChanges();
  }
  getTables(barId){
    return this.afs.collection('tables', ref=>ref.where('barId','==',barId)).snapshotChanges();
  }
  getMenuItems(barId, page) {
    return this.afs.collection('menuitems', ref=>ref.where('barId','==',barId).where('page','==',page)).snapshotChanges();
  }
  getSpecificCategory(category) {
    return this.afs.collection('categories', ref=>ref.where('categoryId','==',category)).snapshotChanges();
  }
  updateCategory(categoryId,data) {
    return this.afs.doc('categories/'+categoryId).update(data);
  }
  deleteCategory(categoryId){
    return this.afs.doc('categories/'+categoryId).delete();
  }
  addMenuItem(data) {
    return this.afs.doc('menuitems/'+data.itemId).set(data);
  }
  getSingleMenuItem(itemId) {
    return this.afs.collection('menuitems', ref=>ref.where('itemId','==',itemId)).snapshotChanges();
  }
  updateMenuItem(itemId,data) {
    return this.afs.doc('menuitems/'+itemId).update(data);
  }
  getSingleBar(barId) {
    return this.afs.doc('userbars/'+barId).valueChanges();
  }
  getSingleBarOpeningHours(barId) {
    return this.afs.doc('bar_openinghours/'+barId).valueChanges();
  }
  checkMenuItems(barId, page) {
    return this.afs.collection('menuitems',ref=>ref.where("barId","==",barId).where("page","==",page)).snapshotChanges();
  }
  getMenuItemsAll(barId) {
    return this.afs.collection('menuitems',ref=>ref.where("barId","==",barId)).snapshotChanges();
  }
  getMenuItemsBasedOnCategory(categoryId) {
    return this.afs.collection('menuitems',ref=>ref.where("categoryId","==",categoryId)).snapshotChanges();
  }
  getCategories(barId, page) {
    return this.afs.collection('categories',ref=>ref.where("barId","==",barId).where("page","==",page)).snapshotChanges();
  }
  updateSingleBar(barId,data) {
    return this.afs.doc('userbars/'+barId).update(data);
  }
  updatSingleBarOpeningHours(barId,data) {
    return this.afs.doc('bar_openinghours/'+barId).update(data);
  }
  addNews(data) {
    return this.afs.doc('news/'+data.newsId).set(data);
  }
  getBarNews(barId) {
    return this.afs.collection('news', ref=>ref.where('barId','==',barId)).snapshotChanges();
  }
  getSingleNews(newsId) {
    return this.afs.doc('news/'+newsId).valueChanges();
  }
  updateSingleNews(data) {
    return this.afs.doc('news/'+data.newsId).update(data);
  }
  deleteNews(newsId) {
    return this.afs.doc('news/'+newsId).delete();
  }
  getAssignedBars(userId) {
    return this.afs.collection('users', ref=>ref.where('assignedBy','==',userId).where('accountType','==','barmember').where('status','==','active')).snapshotChanges();
  }
  getAssignedSingleBar(barId) {
    return this.afs.collection('userbars', ref=>ref.where('barId','==',barId).where('status','==','active')).snapshotChanges();
  }
  getAllUsers() {
    return this.afs.collection('users',ref=>ref.where('accountType','==','barowner')).snapshotChanges();
  }
  getAllBars() {
    return this.afs.collection('userbars',ref=>ref.where('status','==','active')).snapshotChanges();
  }
  getSearchPackages(packageId) {
    return this.afs.collection('user_packages', ref=>ref.where('packageId','==',packageId)).snapshotChanges();
  }
  getSearchMenuItems(categoryId) {
    return this.afs.collection('menuitems', ref=>ref.where('categoryId','==',categoryId)).snapshotChanges();
  }
  getSearchNameEmail(nameEmail) {
    return this.afs.collection('users', ref=>ref.where('email','==',nameEmail)).snapshotChanges();
  }
  getBarSearch(barName) {
    return this.afs.collection('userbars', ref=>ref.where('barName','==',barName)).snapshotChanges();
  }
  getAppUserSearch(email){
    return this.afs.collection('users', ref=>ref.where('email','==',email)).snapshotChanges();
  }
  deleteMenuItems(itemId) {
    return this.afs.doc('menuitems/'+itemId).delete();
  }
  getBarMenuItems(barId,page) {
    return this.afs.collection('menuitems', ref=>ref.where('barId','==',barId).where("page",'==',page)).snapshotChanges();
  }
  getBarMakeMenuItems(barId,page) {
    return this.afs.collection('menuitems', ref=>ref.where('barId','==',barId).where("page",'==',page).where("make","==","yes")).snapshotChanges();
  }
  deleteAccount(data) {
    return this.afs.doc('users/'+data.userId).update(data);
  }
  deleteBar(data) {
    return this.afs.doc('userbars/'+data.barId).update(data);
  }


  updateUserPackage(userId,data) {
    return this.afs.doc('user_packages/'+userId).update(data);
  }
  checkAssignedBar(barId) {
    return this.afs.collection('users', ref=>ref.where('assignedBar','==',barId).where("accountType",'==',"barmember")).snapshotChanges();
  }
  getAllTables(barId) {
    return this.afs.collection('userbars', ref=>ref.where('barId','==',barId)).snapshotChanges();
  }
  getOrders(barId,status){
    return this.afs.collection('userOrders', ref=>ref.where('barId','==',barId).where("status","==",status)).snapshotChanges();
  }
  getOrdersDetails(orderId){
    return this.afs.collection('orders', ref=>ref.where('userOrderId','==',orderId).orderBy("orderTime","desc")).snapshotChanges();
  }
  getAllOrderOnOrderId(orderId) {
    return this.afs.collection('orderDetails', ref=>ref.where('orderId','==',orderId)).snapshotChanges();
  } 
  getOrderStatus(orderId) {
    return this.afs.collection('userOrders', ref=>ref.where('userOrderId','==',orderId)).snapshotChanges();
  }
  updateOrderStatus(orderId,data) {
    return this.afs.doc('userOrders/'+orderId).update(data);
  }
  searchTableOrders(barId,tableId,status) {
    return this.afs.collection('userOrders', ref=>ref.where('tableNo','==',tableId).where("barId","==",barId).where("status","==",status)).snapshotChanges();
  }
  getMonthDownloads(date, barId) {
    return this.afs.collection('userOrders', ref=>ref.where('barId','==',barId).where("dateExport","==",date)).snapshotChanges();
  }
  deleteOldOrders(orderId) {
    return this.afs.doc('orders/'+orderId).delete();
  }
  deleteOldUserOrders(orderId) {
    return this.afs.doc('userOrders/'+orderId).delete();
  }
  getUserPackageExpiryDate(userId) {
    return this.afs.collection('user_packages', ref=>ref.where('userId','==',userId)).snapshotChanges();
  }
  getSingleItem(itemId){
   return this.afs.collection('menuitems', ref=>ref.where('itemId','==',itemId)).snapshotChanges();
  }
  getCategoryPrice(categoryId) {
    let ref = this.afs.collection('categories').doc(categoryId);
    return ref.get();
  }
  createUserOrder(orderId,data) {
    return this.afs.doc('userOrders/'+orderId).set(data);
  }
  createOrder(orderId,data) {
    return this.afs.doc('orders/'+orderId).set(data);
  }
  createOrderDetails(orderId,data) {
    return this.afs.doc('orderDetails/'+orderId).set(data);
  }
  getAllAppUsers(){
    return this.afs.collection('users',ref=>ref.where('accountType','==','user')).snapshotChanges();
  }
  getSingleAppUser(userId){
    return this.afs.doc('users/'+userId).valueChanges();
  }

  updateSingleAppUser(userId,data){
    return this.afs.doc('users/'+userId).update(data);
  }

  getAllUserOrders(userId){
    return this.afs.collection('userOrders',ref=>ref.where('orderedBy','==',userId)).snapshotChanges();
  }

  getAllOrders(userId){
    return this.afs.collection('orders',ref=>ref.where('userId','==',userId)).snapshotChanges();
  }

  getAllOrderDetails(orderId){
    return this.afs.collection('orderDetails',ref=>ref.where('orderId','==',orderId)).snapshotChanges();
  }

  getBarFavourites(userId){
    return this.afs.collection('barfavourites',ref=>ref.where('userId','==',userId)).snapshotChanges();
  }
////////
  getBarUsers(barId){
    return this.afs.collection('barUsers',ref=>ref.where('barId','==',barId)).snapshotChanges();
  }
  getBarUsersByuserId(userId){
    return this.afs.collection('barUsers',ref=>ref.where('userId','==',userId)).snapshotChanges();
  }

  getBarImages(barId){
    return this.afs.collection('barImages',ref=>ref.where('barId','==',barId)).snapshotChanges();
  }
  getBarOpeningHours(barId){
    return this.afs.collection('bar_openinghours',ref=>ref.where('barId','==',barId)).snapshotChanges();
  }
  getBarFavs(barId){
    return this.afs.collection('barfavourites',ref=>ref.where('barId','==',barId)).snapshotChanges();
  }
  getBarCategoriess(barId){
    return this.afs.collection('categories',ref=>ref.where('barId','==',barId)).snapshotChanges();
  }
  getBarMenuItemss(categoryId){
    return this.afs.collection('menuitems',ref=>ref.where('categoryId','==',categoryId)).snapshotChanges();
  }
  getBarNewss(barId){
    return this.afs.collection('news',ref=>ref.where('barId','==',barId)).snapshotChanges();
  }

  getAllUserOrderss(barId){
    return this.afs.collection('userOrders',ref=>ref.where('barId','==',barId)).snapshotChanges();
  }

  getAllOrderss(barId){
    return this.afs.collection('orders',ref=>ref.where('barId','==',barId)).snapshotChanges();
  }
  getBarFavouritess(barId){
    return this.afs.collection('barfavourites',ref=>ref.where('barId','==',barId)).snapshotChanges();
  }

  getBarTables(barId){
    return this.afs.collection('tables',ref=>ref.where('barId','==',barId)).snapshotChanges();
  }

  getServices(barId){
    return this.afs.collection('services',ref=>ref.where('barId','==',barId)).snapshotChanges();
  }

  ///



  deleteOrderDetails(orderDetailId){
    return this.afs.doc('orderDetails/'+orderDetailId).delete();
  }

  deleteOrder(orderId){
    return this.afs.doc('orders/'+orderId).delete();
  }

  deleteUserOrders(userOrderId){
    return this.afs.doc('userOrders/'+userOrderId).delete();
  }
  deleteBarFavourites(favId){
    return this.afs.doc('barfavourites/'+favId).delete();
  }

  deleteAppUser(userId){
    return this.afs.doc('users/'+userId).delete();
  }

  /////////////
  deleteBarUser(userId){
    return this.afs.doc('barUsers/'+userId).delete();
  }

  deleteBarTable(tableId){
    return this.afs.doc('tables/'+tableId).delete();
  }

  deleteService(sId){
    return this.afs.doc('services/'+sId).delete();
  }

  deletesingleBar(barId){
    return this.afs.doc('userbars/'+barId).delete();
  }

  addService(serviceId, data){
    return this.afs.doc('services/'+serviceId).set(data);
  }

  
  
}
