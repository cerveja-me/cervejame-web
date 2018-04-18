import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import { LocationProvider } from '../../providers/location/location';
import { UserProvider } from '../../providers/user/user';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { ModalLoginPage } from '../modal-login/modal-login';
import { ModalSchedulePage } from '../modal-schedule/modal-schedule';
import { ModalVoucherPage } from '../modal-voucher/modal-voucher';


@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})
export class AddressPage {
  products = [];
  location = {};

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
    private modal: ModalController) {
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
      this.location = l;
      this.products = l['zone']['products'];
      this.navCtrl.setRoot(HomePage, { 'zone': l })

    } catch (error) {
      if (typeof error === 'string') {
        this.err = error;
      } else {
        this.err = error;
      }
      // this.analitycs.registerEvent(this.err, this.addressOptions)
      console.log(error)
    }
    this.loadedcompleted = true;
  }

  tryAgain() {
    this.navCtrl.setRoot(AddressPage);
    this.analitycs.registerEvent('try_again', {})
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
    this.analitycs.registerEvent('open_partner', {})
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


  openModalVoucher() {
    // this.device.registerEvent('open_voucher', {});
    let voucherModal = this.modal.create(ModalVoucherPage);//,{}, {});
    voucherModal.present().then(r => {
      // this.device.camPage("home");
    })
  }

}
