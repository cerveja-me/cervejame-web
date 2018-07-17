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
  phone:string;
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

  async askPhoneAndComplement(){
    let prompt = this.alertCtrl.create({
      title: 'Telefone',
      message: "Para melhorar sua entrega, informe seu telefone.",
      inputs: [
        {
          name: 'phone',
          placeholder: '(XX) 99999-9999',
          type: 'tel',
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            this.analitycs.registerEvent('order_canceled',{});
          }
        },
        {
          text: 'Continuar',
          handler:   async data => {
            if (data.phone) {
              await this.user.costumerUpdate(data.phone)
              this.finishOrder()
            }
          }
        }
      ]
    });
    prompt.present();
  }

 async finishOrder() {
    try {
      console.log('finaliza')
      let o:any  = await this.order.completeOrder();
      this.navCtrl.setRoot(StatusPage)
      this.analitycs.registerEvent('purchase', {
        transaction_id: o.id,
        affiliation: this.order.locale.zone.name,
        value: o.price,
        currency: "BRL",
        tax: 0,
        shipping: o.freight_value,
        checkout_option: this.order.sale.payment==1?'money':'card',
        items:this.order.sale.icebox.map(p=>{
          return {
            id: p.id,
            name: p.name,
            list_name: this.order.locale.zone.name,
            category: "beer",
            variant: p.description,
            // list_position: 1,
            quantity: p.items,
            price: p.price
          }
        })
      })
      console.log('compra final')
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
        case 1004:
          this.askPhoneAndComplement()
        default:
          console.log('error', error)
          break;
      }
    }

  }
}
