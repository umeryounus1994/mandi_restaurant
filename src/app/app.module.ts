import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrdersComponent } from './bar/orders/orders.component';
import { SettingsComponent } from './bar/settings/settings.component';
import { ShishaComponent } from './bar/cards/shisha/shisha.component';
import { DrinksComponent } from './bar/cards/drinks/drinks.component';
import { FoodsComponent } from './bar/cards/foods/foods.component';
import { DownloadsComponent } from './bar/orders/downloads/downloads.component';
import { OrderComponent } from './bar/orders/order/order.component';
import { LoginComponent } from './start/login/login.component';
import { RegisterComponent } from './start/register/register.component';
import { PasswordResetComponent } from './start/login/password-reset/password-reset.component';


//Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule} from 'angularfire2/storage';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { environment } from '../environments/environment';

import { AuthService } from './providers/auth.service';
import { ApiService } from './providers/api.service';
import { CartService } from './providers/cart.service';
import { FormsModule } from '@angular/forms';

import { NgxSpinnerModule } from 'ngx-spinner';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgxMaskModule } from 'ngx-mask';
import { TextMaskModule } from 'angular2-text-mask';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { NgxPayPalModule } from 'ngx-paypal';
import { ExportService } from './providers/export.service';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { HttpClientModule  } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ExportToCsv } from 'export-to-csv';
import { AddComponent } from './bar/orders/add/add.component';
import { CartComponent } from './bar/orders/cart/cart.component';
import { StorageServiceModule } from 'angular-webstorage-service';
import { OverviewComponent } from './barowner/overview/overview.component';
import { AccountSettingsComponent } from './barowner/account-settings/account-settings.component';
import { CreateBarComponent } from './barowner/overview/create-bar/create-bar.component';

import { CardsComponent } from './bar/cards/cards.component';
import { CreateShishaItemComponent } from './bar/cards/shisha/create-shisha-item/create-shisha-item.component';
import { CreateShishaCategoryComponent } from './bar/cards/shisha/create-shisha-category/create-shisha-category.component';
import { EditShishaCategoryComponent } from './bar/cards/shisha/edit-shisha-category/edit-shisha-category.component';
import { EditShishaItemComponent } from './bar/cards/shisha/edit-shisha-item/edit-shisha-item.component';
import { CreateDrinksCategoryComponent } from './bar/cards/drinks/create-drinks-category/create-drinks-category.component';
import { CreateDrinksItemComponent } from './bar/cards/drinks/create-drinks-item/create-drinks-item.component';
import { EditDrinksItemComponent } from './bar/cards/drinks/edit-drinks-item/edit-drinks-item.component';
import { EditDrinksCategoryComponent } from './bar/cards/drinks/edit-drinks-category/edit-drinks-category.component';
import { CreateFoodsCategoryComponent } from './bar/cards/foods/create-foods-category/create-foods-category.component';
import { CreateFoodsItemComponent } from './bar/cards/foods/create-foods-item/create-foods-item.component';
import { EditFoodsItemComponent } from './bar/cards/foods/edit-foods-item/edit-foods-item.component';
import { EditFoodsCategoryComponent } from './bar/cards/foods/edit-foods-category/edit-foods-category.component';
import { EditUserComponent } from './barowner/account-settings/user/edit-user/edit-user.component';
import { CreateUserComponent } from './barowner/account-settings/user/create-user/create-user.component';
import { TablesComponent } from './bar/settings/tables/tables.component';
import { BarAccountsComponent } from './admin/bar-accounts/bar-accounts.component';
import { BarownerAccountsComponent } from './admin/barowner-accounts/barowner-accounts.component';
import { UserAccountsComponent } from './admin/user-accounts/user-accounts.component';
import { UserAccountComponent } from './admin/user-accounts/user-account/user-account.component';
import { BarAccountComponent } from './admin/bar-accounts/bar-account/bar-account.component';
import { BarownerAccountComponent } from './admin/barowner-accounts/barowner-account/barowner-account.component';

import { FileDropModule } from 'ngx-file-drop';
import { HeaderAdminComponent } from './admin/header-admin/header-admin.component';
import { HeaderBarComponent } from './bar/header-bar/header-bar.component';
import { HeaderOwnerComponent } from './barowner/header-owner/header-owner.component';
import { ServicesComponent } from './bar/settings/services/services.component';
import { CreateServiceComponent } from './bar/settings/services/create-service/create-service.component';
import { StatisticsComponent } from './bar/statistics/statistics.component';

// import ngx-translate and the http loader
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient} from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    OrdersComponent,
    SettingsComponent,
    ShishaComponent,
    DrinksComponent,
    FoodsComponent,
    OrderComponent,
    LoginComponent,
    RegisterComponent,
    PasswordResetComponent,
    DownloadsComponent,
    AddComponent,
    CartComponent,
    OverviewComponent,
    AccountSettingsComponent,
    CreateBarComponent,
    CardsComponent,
    CreateShishaItemComponent,
    CreateShishaCategoryComponent,
    EditShishaCategoryComponent,
    EditShishaItemComponent,
    CreateDrinksCategoryComponent,
    CreateDrinksItemComponent,
    EditDrinksItemComponent,
    EditDrinksCategoryComponent,
    CreateFoodsCategoryComponent,
    CreateFoodsItemComponent,
    EditFoodsItemComponent,
    EditFoodsCategoryComponent,
    EditUserComponent,
    CreateUserComponent,
    TablesComponent,
    BarAccountsComponent,
    BarownerAccountsComponent,
    UserAccountsComponent,
    UserAccountComponent,
    BarAccountComponent,
    BarownerAccountComponent,
    HeaderAdminComponent,
    HeaderBarComponent,
    HeaderOwnerComponent,
    ServicesComponent,
    CreateServiceComponent,
    StatisticsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    FormsModule,
    NgxSpinnerModule,
    GooglePlaceModule,
    NgxMaskModule,
    TextMaskModule,
    NgxPayPalModule,
    Ng2ImgMaxModule,
    HttpClientModule,
    HttpModule,
    StorageServiceModule,
    FileDropModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        })
  ],
   providers: [AuthService,ExportService,CartService,{provide: LocationStrategy, useClass: HashLocationStrategy}],
  //providers: [AuthService,ApiService,{provide: LocationStrategy, useClass: PathLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http);
// }