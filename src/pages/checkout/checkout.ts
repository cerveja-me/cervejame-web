import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';

/**
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
  sale: any;
  voucher: any;
  locale: any;
  values: any = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private order: OrderProvider) {
  }

  ionViewDidLoad() {
    this.loaddata();
  }
  loaddata() {
    this.sale = this.order.getSale();
    this.voucher = this.order.getVoucher();
    this.locale = this.order.getLocale();
    this.values.total = this.sale.icebox.map(e => (e.price * e.items)).reduce((b, n) => {
      return b + n
    }, 0);
    this.values.discount = this.voucher ? this.voucher.value : 0;
    this.values.total += this.locale.zone.freight_value;
    this.values.total -= this.values.discount;
    console.log('values- .', this.values);

  }

}
