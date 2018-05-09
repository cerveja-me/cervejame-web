import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AnalyticsProvider } from '../../providers/analytics/analytics';

/**
 * Generated class for the ProfileReferralsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile-referrals',
  templateUrl: 'profile-referrals.html',
})
export class ProfileReferralsPage {
  user_data:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private analitycs: AnalyticsProvider
  ) {
  }

  ionViewDidLoad() {
    this.user_data = this.navParams.get('profile');
    this.analitycs.registerPage('friend_referral_referrals');
  }

}
