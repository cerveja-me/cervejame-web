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

  ionViewWillEnter() {
    this.getZone();
  }

  async setAddress(a) {
    await this.loc.setAddress(a)
    this.getZone();
  }


  async getZone() {
    try {
      const l = this.navParams.get('zone');
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

  slideChanged() {
    let current = this.slides.getActiveIndex();
    if (this.products.length === current) {
      this.slides.slidePrev();
    } else {
      this.current = current;
      this.changingSlide = false;
      // this.amount = 2;
      // this.discount = 0.05;
      this.zone.run(() => { });
      this.analitycs.registerEvent('slide_change', this.products[current]);
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

  openPartner() {
    // this.inApp.create('https://cvja.me/2y10JuH')
  }

  openLogin() {
    let loginModal = this.modal.create(ModalLoginPage)
    loginModal.onDidDismiss((data) => {
      // this.analitycs.registerEvent('home', {});
      // this.analitycs.

      if (data === 'success') {
        this.openProfile();
      }
    })
    loginModal.present();
  }

  openSchedule() {
    // this.device.registerEvent('open_schedule', {});
    let scheduleModal = this.modal.create(ModalSchedulePage, { hours: this['location']['zone']['schedule'] })
    scheduleModal.present().then(r => {
      // this.device.camPage("home");
    })
  }

  openModalVoucher() {
    // this.device.registerEvent('open_voucher', {});
    let voucherModal = this.modal.create(ModalVoucherPage);//,{}, {});
    voucherModal.present().then(r => {
      // this.device.camPage("home");
    })
  }

  confirmSale() {
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
