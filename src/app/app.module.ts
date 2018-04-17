import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ModalSchedulePage } from "../pages/modal-schedule/modal-schedule";
import { NetworkProvider } from '../providers/network/network';
import { AnalyticsProvider } from '../providers/analytics/analytics';
import { ConstantsProvider } from '../providers/constants/constants';
import { OrderProvider } from '../providers/order/order';
import { LocationProvider } from '../providers/location/location';
import { DeviceProvider } from '../providers/device/device';
import { StorageProvider } from '../providers/storage/storage';
import { UserProvider } from '../providers/user/user';
import { VoucherProvider } from '../providers/voucher/voucher';
import { ModalLoginPage } from '../pages/modal-login/modal-login';
import { ModalVoucherPage } from '../pages/modal-voucher/modal-voucher';
import { ProfilePage } from '../pages/profile/profile';
import { ModalRegisterPage } from '../pages/modal-register/modal-register';
import { MapPage } from '../pages/map/map';
import { CheckoutPage } from '../pages/checkout/checkout';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProfilePage,
    MapPage,
    CheckoutPage,
    ModalSchedulePage,
    ModalLoginPage,
    ModalVoucherPage,
    ModalRegisterPage
  ],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProfilePage,
    MapPage,
    CheckoutPage,
    ModalSchedulePage,
    ModalLoginPage,
    ModalVoucherPage,
    ModalRegisterPage

  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    NetworkProvider,
    AnalyticsProvider,
    ConstantsProvider,
    OrderProvider,
    LocationProvider,
    DeviceProvider,
    StorageProvider,
    UserProvider,
    VoucherProvider
  ]
})
export class AppModule { }
