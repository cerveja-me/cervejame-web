import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { OrderProvider } from '../../providers/order/order';


@Component({
  selector: 'page-modal-voucher',
  templateUrl: 'modal-voucher.html',
})
export class ModalVoucherPage {
  voucher: string = '';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private network: NetworkProvider,
    private order: OrderProvider) {
  }

  getVoucher(voucher: string) {
    return new Promise((resolve, reject) => {
      this.network.get(this.network.c.VOUCHER + voucher)
        .then((res) => {
          this.order.setVoucher(res);
          resolve(res);
        })
        .catch(reject);
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
