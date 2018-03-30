import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';
import { AnalyticsProvider } from '../../providers/analytics/analytics';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  products = [];
  location: any = {};
  err;
  loadedcompleted;

  constructor(
    public navCtrl: NavController,
    private order: OrderProvider,
    private analitycs: AnalyticsProvider

  ) {

  }

  ionViewDidLoad() {
    this.getZone();
  }

  async getZone() {
    try {
      const l = await this.order.getZone()
      this.location = l;
    } catch (error) {
      this.err = error.message;
      console.log(error.message)
    }
    this.loadedcompleted = true;

  }

  tryAgain() {
    this.navCtrl.setRoot(HomePage);
    this.analitycs.registerEvent('try_again', {})
  }

}
