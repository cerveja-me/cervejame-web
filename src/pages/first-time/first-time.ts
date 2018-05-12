import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import { UserProvider } from '../../providers/user/user';


@Component({
  selector: 'page-first-time',
  templateUrl: 'first-time.html',
})
export class FirstTimePage {

  constructor(
    public view:ViewController,
    public analitycs: AnalyticsProvider,
    private user:UserProvider
  ) {
  }

  ionViewDidLoad() {
    this.analitycs.registerPage('age_confirmation')
  }

  todinho() {
    this.analitycs.registerEvent('under-18', {})
    window.open('https://www.toddynho.com.br/', '_self');
  }

  async over18(){
    this.analitycs.registerEvent('over-18', {})
    this.user.confirmeAge();
    this.view.dismiss();
  }
}
