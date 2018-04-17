import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CheckoutPage } from '../checkout/checkout';

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
  }

  finishOrder() {
    // if()
    // this.order.updateLocationAddress({ 0: this.map.getCenter().lat(), 1: this.map.getCenter().lng() }, this.fulladdress, this.number, this.complement);
    // this.closeEdit();
    //let loca={0:this.map.getCenter().lat(),1:this.map.getCenter().lng()}
    // this.address.street_number = this.number;
    this.navCtrl.push(CheckoutPage);
    // this.device.registerEvent('confirm_address', {});
  }

}
