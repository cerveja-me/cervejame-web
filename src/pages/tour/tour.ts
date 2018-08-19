import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams,Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { DeviceProvider } from '../../providers/device/device';
import { LocationProvider } from '../../providers/location/location';

import { HomePage } from '../home/home';
import { AddressPage } from '../address/address';

@Component({
  selector: 'page-tour',
  templateUrl: 'tour.html',
})
export class TourPage {
  @ViewChild('slides') slides: Slides;

  constructor(
    private navCtrl: NavController,
    private storage: Storage,
    private device: DeviceProvider,
    private location: LocationProvider
  ) {
  }

  ionViewDidLoad() {
    // this.device.camPage("tour");
  }

  startApp() {
    this.navCtrl.setRoot(AddressPage).then(() => {
      this.storage.set('hasSeenTutorial', 'true');
    })
  }

  onSlideChangeStart(slider: Slides) {
    if(slider.realIndex==1){
      this.location.getPosition();
    }
  }

}
