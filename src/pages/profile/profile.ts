import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { ConstantsProvider } from '../../providers/constants/constants';
import { UserProvider } from '../../providers/user/user';
import { DeviceProvider } from '../../providers/device/device';
import { AnalyticsProvider } from '../../providers/analytics/analytics';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  code = '';
  user_data = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private analityc: AnalyticsProvider,
    private c: ConstantsProvider,
    private user: UserProvider,
    private modalCtrl: ModalController,
    private device: DeviceProvider
    //tood social sharing
  ) {
    this.getCostumer(true);
  }

  ionViewDidLoad() {
    this.analityc.registerPage('Profile')
    this.getCostumer(false);
  }
  async getCostumer(cache) {
    try {
      this.user_data = await this.user.getCostumerData(cache);
      this.code = this.user_data['code'].toUpperCase();
    } catch (error) {
      console.log('error retriving code-> ', error)
    }
  }

  shareVia() {
    // this.socialSharing.share(`use meu cupom de desconto: ${this.code} e ganhe R$ 10 de desconto na sua primeira compra pelo app: http://cvja.me/2nAR2vE`);
    this.analityc.registerEvent('friend_referral_share', { code: this.code });
  }

  shareViaWhatsApp() {
    // this.socialSharing.shareViaWhatsApp(`use meu cupom de desconto: ${this.code} e ganhe R$ 10 de desconto na sua primeira compra pelo app: http://cvja.me/2nAR2vE`);
    this.analityc.registerEvent('friend_referral_share_whats_app', { code: this.code });
  }

  shareViaFacebook() {
    // this.socialSharing.shareViaFacebook(`use meu cupom de desconto: ${this.code} e ganhe R$ 10 de desconto na sua primeira compra pelo app: http://cvja.me/2nAR2vE`, 'http://cvja.me/2nAR2vE');
    this.analityc.registerEvent('friend_referral_share_facebook', { code: this.code });
  }

  openTerms() {
    // let modal = this.modalCtrl.create(ProfileTermsPage);
    // modal.present().then(r => {
    //   this.device.camPage("friend_referral_home");
    // })
    this.analityc.registerEvent('friend_referral_open_terms', { code: this.code });

  }

  openReferrals() {
    // let modal = this.modalCtrl.create(ProfileReferralsPage, { profile: this.user_data });
    // modal.present().then(r => {
    //   this.device.camPage("friend_referral_home");
    // })
    this.analityc.registerEvent('friend_referral_open_referrals', { code: this.code });
  }

}
