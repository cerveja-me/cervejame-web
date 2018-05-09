import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AnalyticsProvider } from '../../providers/analytics/analytics';



@Component({
  selector: 'page-profile-terms',
  templateUrl: 'profile-terms.html',
})
export class ProfileTermsPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private analitycs:AnalyticsProvider
  ) {
  }

  ionViewDidLoad() {
    this.analitycs.registerPage('referral-terms');
  }

}
