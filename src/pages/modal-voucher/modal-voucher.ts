import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { NetworkProvider } from '../../providers/network/network';
import { OrderProvider } from '../../providers/order/order';
import { VoucherProvider } from '../../providers/voucher/voucher';


@Component({
  selector: 'page-modal-voucher',
  templateUrl: 'modal-voucher.html',
})
export class ModalVoucherPage {
  code: string;
  voucher_active: boolean = false;
  error_active: boolean = false
  vouch: any;
  closing: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private network: NetworkProvider,
    private order: OrderProvider,
    private voucher: VoucherProvider) {
  }

  ionViewDidLoad() {
    this.code = this.navParams.get('voucher');
  }

  dismiss() {
    this.closing = true;
    setTimeout(() => {
      this.viewCtrl.dismiss(this.vouch);
    }, 300);
  }

  async changecod() {
    this.error_active = false;
    if (this.code.length == 9) {
      try {
        const v = await this.voucher.getVoucher(this.code.replace('#', '$'))
        if (v) {
          this.vouch = v
          this.voucher_active = true;
          setTimeout(a => {
            this.dismiss()
          }, 750);
        } else {
          this.error_active = true
          this.voucher_active = false;
        }
      } catch (error) {
        this.error_active = true
        this.voucher_active = false;
      }
    } else {
      this.voucher_active = false;
    }
  }


}
