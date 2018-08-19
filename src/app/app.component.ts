import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AddressPage } from '../pages/address/address';
import { TourPage } from '../pages/tour/tour';
import { ConstantsProvider } from '../providers/constants/constants';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any; // = HomePage;

  // pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    // public firebase:Firebase,
    private storage: Storage,
    private c: ConstantsProvider
  ) {

    if (c.IS_MOBILE) {
      this.storage.get('hasSeenTutorial')
        .then((hasSeenTutorial) => {
          if (hasSeenTutorial) {
            this.rootPage = AddressPage;
          } else {
            this.rootPage = TourPage;
          }
          this.initializeApp();
        })
    } else {
      this.rootPage = AddressPage;
    }



  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      setTimeout(() => {
        this.splashScreen.hide();
      }, 500);
    });
  }

  // rootPage: any = AddressPage;

  // constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
  //   platform.ready().then(() => {
  //     // Okay, so the platform is ready and our plugins are available.
  //     // Here you can do any higher level native things you might need.
  //     // statusBar.styleDefault();
  //     // splashScreen.hide();
  //   });
  // }
}

