import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, Slides, ModalController, NavParams } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import { LocationProvider } from '../../providers/location/location';
import { ProfilePage } from '../profile/profile';
import { UserProvider } from '../../providers/user/user';
import { ModalSchedulePage } from '../modal-schedule/modal-schedule';
import { ModalLoginPage } from '../modal-login/modal-login';
import { ModalVoucherPage } from '../modal-voucher/modal-voucher';
import { MapPage } from '../map/map';
import { VoucherProvider } from '../../providers/voucher/voucher';
import { StatusPage } from '../status/status';
import 'rxjs/add/observable/interval';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;
  products = [];
  location = {};
  taped = false;
  changingSlide = false;
  amount = 2;
  // ASSETS: string = this.order.c.REMOTE_ASSETS;
  showTip = false;
  current = 0;
  loadedcompleted = true;
  discount = 0;
  updatingAmount;
  loader;
  err: string;
  sale:any;
  sub:any;
  actions: any = {
    accepted: null,
    onWay: null,
    finishedAt: null,
    review: null
  }
  openSale: any;
  fulladdress = '';
  addressOptions = [];

  iceBox: Array<any> = [];
  iceBoxPrice;
  iceBoxTotal;
  removible: boolean = false;
  voucher: any;
  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private order: OrderProvider,
    private analitycs: AnalyticsProvider,
    private zone: NgZone,
    private loc: LocationProvider,
    private user: UserProvider,
    private modal: ModalController
  ) {

  }
  ionViewDidLoad() {
    this.analitycs.registerPage('Home');
  }

  ionViewWillEnter() {
    this.getZone();
    this.verifyOpenSale();
    this.sub = Observable.interval(10000)
      .subscribe((val) => {
        this.verifyOpenSale();
      });
  }

  async setAddress(a) {
    await this.loc.setAddress(a)
    this.getZone();
  }


  async getZone() {
    try {
      let l = this.navParams.get('zone');
      if(!l){
        l = this.order.getLocale()
      }
      this.location = l;
      this.products = l['zone']['products'];
      this.slideChanged();

    } catch (error) {
      if (typeof error === 'string') {
        this.err = error;
      } else {
        this.err = error;
      }
    }
    this.err = null;
    this.loadedcompleted = true;
  }

  openStatus(){
    this.navCtrl.setRoot(StatusPage)
  }

  slideChanged() {
    let current = this.slides.getActiveIndex();
    if (this.products.length === current) {
      this.slides.slidePrev();
    } else {
      this.current = current;
      this.changingSlide = false;
      this.zone.run(() => { });
      this.analitycs.registerEvent('slide_change', { product: this.products[current], pos: current + 1, slides: this.products.length, slide: (current + 1) + ' of ' + this.products.length });
    }
    let i = this.iceBox.findIndex((item, i) => {
      return item.product === this.products[current]
    })
    if (i > -1) {
      this.removible = false;
    } else {
      this.removible = true;
    }
  }

  onTaped(event) {
    this.taped = true;
    this.changingSlide = true;
  }

  openProfile() {
    this.user.isAuth()
      .then(u => {
        // this.device.registerEvent('open_profile_voucher', {});
        this.navCtrl.push(ProfilePage);
      })
      .catch(e => {
        this.openLogin();
      })
  }

  async verifyOpenSale() {
    try {
      this.sale = await this.order.getOrders();
      if (this.sale){
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
                // this.actionClose = 'Avaliar Entrega'
                // this.zone.run(() => { });
                break;
            }
          }
        }
      }
    } catch (error) {
      console.log('erro ->', error);
    }

  }


  openLogin() {
    let loginModal = this.modal.create(ModalLoginPage)
    loginModal.onDidDismiss((data) => {
      this.analitycs.registerPage('Home');
      if (data === 'success') {
        this.openProfile();
      }
    })
    loginModal.present();
  }

  openSchedule() {
    this.analitycs.registerEvent('open_schedule', {});
    let scheduleModal = this.modal.create(ModalSchedulePage, { hours: this['location']['zone']['schedule'] })
    scheduleModal.present();
    scheduleModal.onWillDismiss(v => {
      this.analitycs.registerPage('Home');
    })
  }

  openModalVoucher() {
    this.analitycs.registerEvent('open_voucher', {});
    let voucherModal = this.modal.create(ModalVoucherPage);//,{}, {});
    voucherModal.present();
    voucherModal.onWillDismiss(v => {
      this.voucher = v;
      this.analitycs.registerPage('Home');
    })
  }

  confirmSale() {
    this.order.setItems(this.iceBox);
    this.order.createOrder();
    this.navCtrl.push(MapPage)
  }

  addToIceBox(product, index) {
    this.analitycs.registerEvent('addToIceBox', product);
    if (this.products[index].items) {
      this.products[index].items++;
    } else {
      this.products[index].items = 1;
    }
    this.updateIceBox();
  }
  removeFromIceBox(product, index) {
    this.analitycs.registerEvent('removeFromIceBox', product);
    if (this.products[index].items) {
      this.products[index].items--;
      this.updateIceBox();
    }
  }

  updateIceBox() {
    this.iceBox = this.products.filter(p => {
      return p.items > 0
    })
    if (this.iceBox.length) {
      this.iceBoxPrice = this.iceBox.map(e => (e.price * e.items)).reduce((b, n) => {
        return b + n
      }, 0)
      this.iceBoxTotal = this.iceBox.map(e => (e.items)).reduce((b, n) => {
        return b + n
      }, 0)
    }
  }
}
