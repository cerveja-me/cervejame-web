import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { OrderProvider } from '../../providers/order/order';
import 'rxjs/add/observable/interval';

import { Observable } from 'rxjs/Observable';
import { AnalyticsProvider } from '../../providers/analytics/analytics';

@Component({
  selector: 'page-status',
  templateUrl: 'status.html',
})
export class StatusPage {
  sales:any;
  sale: any;
  actions: any = {
    accepted: null,
    onWay: null,
    finishedAt: null
  }
  sub:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private order: OrderProvider,
    private analitycs: AnalyticsProvider,
    private events: Events
) {
    this.events.subscribe('push:order_update', data => {
      this.verifyOpenSale();
    });
    this.sub = Observable.interval(10000)
      .subscribe((val) => {
        this.verifyOpenSale();
      });
  }

  ionViewDidLoad() {
    this.analitycs.registerPage('status');
    this.verifyOpenSale();
  }

  async verifyOpenSale(){
    try {
      this.sales = await this.order.getOrders();
      console.log('vendas abertas -> ',this.sales)
    } catch (error) {

    }

  }

  backHome() {
    this.navCtrl.setRoot(HomePage);
  }

}
