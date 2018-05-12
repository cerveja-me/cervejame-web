import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { OrderProvider } from '../../providers/order/order';
import 'rxjs/add/observable/interval';

import { Observable } from 'rxjs/Observable';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import { FeedbackPage } from '../feedback/feedback';

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
  actionClose:string='Fechar';

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

  ionViewDidLeave(){
    this.sub.unsubscribe();
  }

  ionViewDidLoad() {
    this.analitycs.registerPage('status');
    this.verifyOpenSale();
  }

  async verifyOpenSale(){
    try {
      this.sale = await this.order.getOrders();
      if (this.sale.complement) {
        this.sale.complement = ' compl.:' + this.sale.complement;
      }
      if (this.sale.actions) {
        for (let i = 0; i < this.sale.actions.length; i++) {
          switch (this.sale.actions[i].action) {
            case 1:
              this.actions.accepted = this.sale.actions[i];
              break;
            case 2:
              this.actions.onWay = this.sale.actions[i];
              // this.zone.run(() => { });
              break;
            case 4:
              this.actions.finishedAt = this.sale.actions[i];
              this.actionClose = 'Avaliar Entrega'
              // this.zone.run(() => { });
              break;
          }

        }

      }
      console.log('vendas abertas -> ',this.sale)
    } catch (error) {
      console.log('erro ->',error);
    }

  }

  close() {
    if(this.actionClose==='Fechar'){
      this.navCtrl.setRoot(HomePage)
    }else{
      this.navCtrl.setRoot(FeedbackPage, { sale: this.sale });
    }
  }
}
