import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, LOCALE_ID } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);


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
import { AddressPage } from '../pages/address/address';
import { StatusPage } from '../pages/status/status';
import { FeedbackPage } from '../pages/feedback/feedback';
import { ProfileTermsPage } from '../pages/profile-terms/profile-terms';
import { ProfileReferralsPage } from '../pages/profile-referrals/profile-referrals';
import { FirstTimePage } from '../pages/first-time/first-time';
import { FacebookProvider } from '../providers/facebook/facebook';
import { TourPage } from '../pages/tour/tour';
import { Facebook } from '@ionic-native/facebook';


@NgModule({
  declarations: [
    MyApp,
    AddressPage,
    HomePage,
    ProfilePage,
    MapPage,
    CheckoutPage,
    ModalSchedulePage,
    ModalLoginPage,
    ModalVoucherPage,
    ModalRegisterPage,
    StatusPage,
    FeedbackPage,
    ProfileTermsPage,
    ProfileReferralsPage,
    FirstTimePage,
    TourPage
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
    AddressPage,
    HomePage,
    ProfilePage,
    MapPage,
    CheckoutPage,
    ModalSchedulePage,
    ModalLoginPage,
    ModalVoucherPage,
    ModalRegisterPage,
    StatusPage,
    FeedbackPage,
    ProfileTermsPage,
    ProfileReferralsPage,
    FirstTimePage,
    TourPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    NetworkProvider,
    AnalyticsProvider,
    ConstantsProvider,
    OrderProvider,
    LocationProvider,
    DeviceProvider,
    StorageProvider,
    UserProvider,
    VoucherProvider,
    Facebook,
    FacebookProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: LOCALE_ID, useValue: 'pt-BR' }

  ]
})
export class AppModule { }
