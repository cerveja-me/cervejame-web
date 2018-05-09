import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import { ModalLoginPage } from '../modal-login/modal-login';
import { HomePage } from '../home/home';
import { StatusPage } from '../status/status';
import { ModalVoucherPage } from '../modal-voucher/modal-voucher';
import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
  sale: any;
  voucher: any;
  locale: any;
  values: any = {};
  payment;
  friendRef:any;
  constructor(
    public navCtrl: NavController,
    private modal: ModalController,
    private alertCtrl: AlertController,
    public navParams: NavParams,
    private analitycs: AnalyticsProvider,
    private user: UserProvider,
    private order: OrderProvider) {
  }

  ionViewDidLoad() {
    this.analitycs.registerPage("Checkout");
    this.loaddata();
  }

  async loaddata() {
    this.sale = this.order.getSale();
    this.voucher = this.order.getVoucher();
    this.locale = this.order.getLocale();
    this.friendRef = await this.user.getCostumerData(false);
    if(this.friendRef){
      this.order.setFriendRef(this.friendRef);
    }
    this.values.itens = this.sale.icebox.map(e => (e.price * e.items)).reduce((b, n) => {
      return b + n
    }, 0);
    this.values.total = this.values.itens;
    this.values.discount = this.voucher ? this.voucher.value : 0;
    this.values.total += this.locale.zone.freight_value;
    this.values.total -= this.voucher ? this.voucher.value : 0;
    this.values.total -= this.friendRef ? this.friendRef.available_value : 0
    this.payment = this.sale.payment;
  }

  setPayment(type){
    this.payment = type;
    this.order.sale.payment= type;
    this.analitycs.registerEvent('payment_selected',type)
  }

  close(){
    this.navCtrl.pop();
  }

  openModalVoucher() {
    this.analitycs.registerEvent('open_voucher_checkout', {});
    let voucherModal = this.modal.create(ModalVoucherPage);
    voucherModal.present();
    voucherModal.onWillDismiss(v => {
      this.voucher = v;
      this.analitycs.registerPage('Checkout');
      this.loaddata()
    })
  }

  openLogin() {
    let loginModal = this.modal.create(ModalLoginPage)
    loginModal.onDidDismiss((data) => {
      this.analitycs.registerPage('Checkout');
      if (data === 'success') {
        this.finishOrder();
      }
    })
    loginModal.present();
  }

 async selectPayment(){
  this.alertCtrl.create({
     title: 'Como quer Pagar?',
     message: 'Selecione um meio de pagamento!',
     buttons: [
       {
         text: 'Cartão',
         handler: data => {
           this.analitycs.registerEvent('modal_select_payment', { payment: 'cartao' });
           this.setPayment(2);
           this.finishOrder();
         }
       },
       {
         text: 'Dinheiro',
         handler: data => {
           this.analitycs.registerEvent('modal_select_payment', { payment: 'dinheiro' });
           this.setPayment(1);
           this.finishOrder();
         }
       }
     ]
   }).present();
 }

 async voucherError(m){
   this.order.removeVoucher();
   this.loaddata();
   let alert = this.alertCtrl.create({
     title: 'Opa!!!!',
     message: m,
     buttons: ['Ok']
   });
   alert.present();
  }

 async finishOrder() {
    try {
      console.log('finaliza')
      let o  = await this.order.completeOrder();
      this.navCtrl.setRoot(StatusPage)

    } catch (error) {
      switch (error.code) {
        case 1000:
          this.openLogin();
          break;
        case 1001:
          this.openLogin();
          break;
        case 1002:
          this.selectPayment()
          break;
        case 1003:
          this.voucherError(error.text_message)
        default:
          console.log('error', error)
          break;
      }
    }

  }
}
