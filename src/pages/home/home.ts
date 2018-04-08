import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, Slides, ModalController } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import { LocationProvider } from '../../providers/location/location';
import { ProfilePage } from '../profile/profile';
import { UserProvider } from '../../providers/user/user';
import { ModalSchedulePage } from '../modal-schedule/modal-schedule';
import { ModalLoginPage } from '../modal-login/modal-login';
import { ModalVoucherPage } from '../modal-voucher/modal-voucher';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  products = [];
  location = {};
  @ViewChild(Slides) slides: Slides;
  taped = false;
  changingSlide = false;
  amount = 2;
  selectedBeer: any;
  // ASSETS: string = this.order.c.REMOTE_ASSETS;
  showTip = false;
  current = 0;
  loadedcompleted = true;
  err = 'PROVIDE_ADDRESS';
  discount = 0;
  updatingAmount;
  loader;
  actions: any = {
    accepted: null,
    onWay: null,
    finishedAt: null,
    review: null
  }
  openSale: any;
  fulladdress = '';
  addressOptions = [];
  constructor(
    public navCtrl: NavController,
    private order: OrderProvider,
    private analitycs: AnalyticsProvider,
    private zone: NgZone,
    private loc: LocationProvider,
    private user: UserProvider,
    private modal: ModalController
  ) {

  }



  ionViewDidLoad() {
    // this.verifyFirstTime();

  }

  // async verifyFirstTime(){
  //   const firsttime =this.
  // }

  closeAddressEdit() {
    console.log()
  }
  async setAddress(a) {
    await this.loc.setAddress(a)
    this.getZone();
  }

  async addressChange() {
    this.addressOptions = await this.loc.getLocationsFromAddress(this.fulladdress, null)
  }

  async getZone() {
    try {
      const l = await this.order.getZone();
      console.log('l->', l);
      this.location = l;
      this.products = l['zone']['products'];
      console.log('prd', this.products)
      this.slideChanged();

    } catch (error) {
      if (typeof error === 'string') {
        this.err = error;
      } else {
        this.err = error;
      }

      console.log(error)
    }
    this.err = null;
    this.loadedcompleted = true;
  }

  tryAgain() {
    this.navCtrl.setRoot(HomePage);
    this.analitycs.registerEvent('try_again', {})
  }


  slideChanged() {
    let current = this.slides.getActiveIndex();
    if (this.products.length === current) {
      this.slides.slidePrev();
    } else {
      this.current = current;
      this.changingSlide = false;
      this.amount = 2;
      this.discount = 0.05;
      this.zone.run(() => { });
      // this.device.registerEvent('slide_change', this.products[current]);
      // TODO analitycs
      this.selectedBeer = {
        beer: this.products[current],
        discount: this.discount,
        amount: this.amount
      }
      this.updatePriceAndDiscount();
    }
  }

  updatePriceAndDiscount() {
    if (this.selectedBeer.beer.progressive_discount) {
      if (this.amount > 2) {
        this.discount = 0.1;
      } else {
        this.discount = (this.amount - 1) * 0.05;
      }

      this.selectedBeer.discount = this.discount;
      this.selectedBeer.amount = this.amount;
      let p = this.selectedBeer.beer.price * this.amount;
      let full = p;
      p = p - (p * this.discount);
      p = Math.round(p);
      this.selectedBeer.discount = 1 - (p / full);
      this.selectedBeer.finalDiscount = this.selectedBeer.discount * 100;
      this.selectedBeer.price = p;
      this.selectedBeer.unitValue = p / (this.selectedBeer.beer.amount * this.amount);
    } else {
      let p = this.selectedBeer.beer.price * this.amount;
      this.selectedBeer.discount = 0;
      this.selectedBeer.finalDiscount = 0;
      this.selectedBeer.price = p;
      this.selectedBeer.unitValue = p / (this.selectedBeer.beer.amount * this.amount);

    }
    this.zone.run(() => { });
  }

  onTaped(event) {
    this.taped = true;
    this.changingSlide = true;
  }
  increaseAmount() {
    this.updatingAmount = true;
    // this.device.registerEvent('increaseAmount',this.selectedBeer.beer)
    this.amount++;
    // this.device.registerEvent('increase_amount', this.selectedBeer.beer)
    this.updatePriceAndDiscount();
    setTimeout(() => {
      this.updatingAmount = false;
    }, 100);
  }

  decreaseAmount() {
    this.updatingAmount = true;
    // this.device.registerEvent('decrease_amount', this.selectedBeer.beer)

    if (this.amount > 1) {
      this.amount--;
      this.updatePriceAndDiscount();
    }
    setTimeout(() => {
      this.updatingAmount = false;
    }, 100);
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
}
