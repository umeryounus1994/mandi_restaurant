import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdersComponent } from './bar/orders/orders.component';

import { SettingsComponent } from './bar/settings/settings.component';


import { DownloadsComponent } from './bar/orders/downloads/downloads.component';
import { OrderComponent } from './bar/orders/order/order.component';

import { LoginComponent } from './start/login/login.component';
import { PasswordResetComponent } from './start/login/password-reset/password-reset.component';
import { RegisterComponent } from './start/register/register.component';
import { AddComponent } from './bar/orders/add/add.component';
import { CartComponent } from './bar/orders/cart/cart.component';

// BAR OWNER 
import { OverviewComponent } from './barowner/overview/overview.component';
import { AccountSettingsComponent } from './barowner/account-settings/account-settings.component';
import { CreateBarComponent } from './barowner/overview/create-bar/create-bar.component';

// BAR
import { CardsComponent } from './bar/cards/cards.component';
import { ShishaComponent } from './bar/cards/shisha/shisha.component';
import { CreateShishaItemComponent } from './bar/cards/shisha/create-shisha-item/create-shisha-item.component';
import { CreateShishaCategoryComponent } from './bar/cards/shisha/create-shisha-category/create-shisha-category.component';
import { EditShishaCategoryComponent } from './bar/cards/shisha/edit-shisha-category/edit-shisha-category.component';
import { EditShishaItemComponent } from './bar/cards/shisha/edit-shisha-item/edit-shisha-item.component';
import { DrinksComponent } from './bar/cards/drinks/drinks.component';
import { CreateDrinksCategoryComponent } from './bar/cards/drinks/create-drinks-category/create-drinks-category.component';
import { EditDrinksItemComponent } from './bar/cards/drinks/edit-drinks-item/edit-drinks-item.component';
import { CreateDrinksItemComponent } from './bar/cards/drinks/create-drinks-item/create-drinks-item.component';
import { EditDrinksCategoryComponent } from './bar/cards/drinks/edit-drinks-category/edit-drinks-category.component';
import { FoodsComponent } from './bar/cards/foods/foods.component';
import { CreateFoodsCategoryComponent } from './bar/cards/foods/create-foods-category/create-foods-category.component';
import { EditFoodsCategoryComponent } from './bar/cards/foods/edit-foods-category/edit-foods-category.component';
import { CreateFoodsItemComponent } from './bar/cards/foods/create-foods-item/create-foods-item.component';
import { EditFoodsItemComponent } from './bar/cards/foods/edit-foods-item/edit-foods-item.component';
import { EditUserComponent } from './barowner/account-settings/user/edit-user/edit-user.component';
import { CreateUserComponent } from './barowner/account-settings/user/create-user/create-user.component';
import { TablesComponent } from './bar/settings/tables/tables.component';
import { BarownerAccountsComponent } from './admin/barowner-accounts/barowner-accounts.component';
import { BarownerAccountComponent } from './admin/barowner-accounts/barowner-account/barowner-account.component';
import { BarAccountsComponent } from './admin/bar-accounts/bar-accounts.component';
import { BarAccountComponent } from './admin/bar-accounts/bar-account/bar-account.component';
import { UserAccountsComponent } from './admin/user-accounts/user-accounts.component';
import { UserAccountComponent } from './admin/user-accounts/user-account/user-account.component';
import { ServicesComponent } from './bar/settings/services/services.component';
import { CreateServiceComponent } from './bar/settings/services/create-service/create-service.component';
import { StatisticsComponent } from './bar/statistics/statistics.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'login/passwort',
    component: PasswordResetComponent
  },
  {
    path: 'registrieren',
    component: RegisterComponent
  },
  {
    path: '',
    component: CardsComponent
  },
  {
    path: 'einstellungen',
    component: AccountSettingsComponent
  },
  {
    path: 'einstellungen/benutzer/erstellen',
    component: CreateUserComponent
  },
  {
    path: 'einstellungen/benutzer/anpassen/:id',
    component: EditUserComponent
  },
  {
    path: 'erstellen',
    component: CreateBarComponent
  },
  {
    path: 'bar',
    component: OrdersComponent
  },
  {
    path: 'bar/bestellung/neu',
    component: AddComponent
  },
  {
    path: 'bar/bestellung/warenkorb',
    component: CartComponent
  },
  {
    path: 'bar/bestellung/downloads',
    component: DownloadsComponent
  },
  {
    path: 'bar/bestellung/details',
    component: OrderComponent
  },
  {
    path: 'bar/karten',
    component: CardsComponent
  },
  {
    path: 'bar/karten/breakfast',
    component: ShishaComponent
  },
  {
    path: 'bar/karten/breakfast/kategorie-erstellen',
    component: CreateShishaCategoryComponent
  },
  {
    path: 'bar/karten/breakfast/kategorie-anpassen',
    component: EditShishaCategoryComponent
  },
  {
    path: 'bar/karten/breakfast/eintrag-erstellen',
    component: CreateShishaItemComponent
  },
  {
    path: 'bar/karten/breakfast/eintrag-anpassen',
    component: EditShishaItemComponent
  },
  {
    path: 'bar/karten/getraenke',
    component: DrinksComponent
  },
  {
    path: 'bar/karten/getraenke/kategorie-erstellen',
    component: CreateDrinksCategoryComponent
  },
  {
    path: 'bar/karten/getraenke/kategorie-anpassen',
    component: EditDrinksCategoryComponent
  },
  {
    path: 'bar/karten/getraenke/eintrag-erstellen',
    component: CreateDrinksItemComponent
  },
  {
    path: 'bar/karten/getraenke/eintrag-anpassen',
    component: EditDrinksItemComponent
  },
  {
    path: 'bar/karten/speisen',
    component: FoodsComponent
  },
  {
    path: 'bar/karten/speisen/kategorie-erstellen',
    component: CreateFoodsCategoryComponent
  },
  {
    path: 'bar/karten/speisen/kategorie-anpassen',
    component: EditFoodsCategoryComponent
  },
  {
    path: 'bar/karten/speisen/eintrag-erstellen',
    component: CreateFoodsItemComponent
  },
  {
    path: 'bar/karten/speisen/eintrag-anpassen/d',
    component: EditFoodsItemComponent
  },
  {
    path: 'bar/statistiken',
    component: StatisticsComponent
  },
  {
    path: 'bar/einstellungen',
    component: SettingsComponent
  },
  {
    path: 'bar/einstellungen/tische',
    component: TablesComponent
  },
  {
    path: 'bar/einstellungen/services',
    component: ServicesComponent
  },
  {
    path: 'bar/einstellungen/services/erstellen',
    component: CreateServiceComponent
  },
  {
    path: 'admin',
    component: BarownerAccountsComponent
  },
  {
    path: 'admin/owners/owner/:id',
    component: BarownerAccountComponent
  },
  {
    path: 'admin/bars',
    component: BarAccountsComponent
  },
  {
    path: 'admin/bars/bar/:id/:id1',
    component: BarAccountComponent
  },
  {
    path: 'admin/users',
    component: UserAccountsComponent
  },
  {
    path: 'admin/users/user',
    component: UserAccountComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
