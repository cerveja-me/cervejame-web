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
import { NetworkProvider } from '../providers/network/network';
import { AnalyticsProvider } from '../providers/analytics/analytics';
import { ConstantsProvider } from '../providers/constants/constants';
import { OrderProvider } from '../providers/order/order';
import { LocationProvider } from '../providers/location/location';


@NgModule({
  declarations: [
    MyApp,
    HomePage
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
    HomePage
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
    LocationProvider
  ]
})
export class AppModule { }
