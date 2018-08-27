import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, LOCALE_ID, Injectable, Injector } from '@angular/core';
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
import { Pro } from '@ionic/pro';
import * as CTS from '../providers/cts';
import { ModalNotificationPage } from '../pages/modal-notification/modal-notification';

Pro.init(CTS.env.ionicAppID, {
  appVersion: CTS.version.appVersion
})

@Injectable()
export class IonicProErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch (e) {
      // Unable to get the IonicErrorHandler provider, ensure
      // IonicErrorHandler has been added to the providers list below
    }
  }

  handleError(err: any): void {
    Pro.monitoring.handleNewError(err);
    // Remove this if you want to disable Ionic's auto exception handling
    // in development mode.
    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}

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
    TourPage,
    ModalNotificationPage
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
    TourPage,
    ModalNotificationPage
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
    { provide: ErrorHandler, useClass: IonicProErrorHandler },
    { provide: LOCALE_ID, useValue: 'pt-BR' }

  ]
})
export class AppModule { }
