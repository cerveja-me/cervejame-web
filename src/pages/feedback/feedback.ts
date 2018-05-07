import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {
  sale:any;
  rate;
  comment;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public order: OrderProvider,
    public analitycs: AnalyticsProvider
  ) {

    this.sale = this.navParams.get('sale');
  }

  ionViewDidLoad() {
    this.analitycs.registerPage('Feeback');
  }

  async sendFeedback() {
    try {
      await this.order.rateOrder({
        id_sale: this.sale.id_sale,
        comment: this.comment,
        rate: this.rate
      });
      this.navCtrl.setRoot(HomePage);
    } catch (error) {
     //TODO
    }
  }

}
