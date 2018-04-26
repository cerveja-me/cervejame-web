import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AnalyticsProvider } from '../../providers/analytics/analytics';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the ModalRegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-modal-register',
  templateUrl: 'modal-register.html',
})
export class ModalRegisterPage {
  profile: any = {
    name: '',
    password: '',
    photo: '',
    login: '',
    phone: '',
    type: 1,
    status: 1
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private analitycs: AnalyticsProvider,
    private user: UserProvider,
    private viewCtrl: ViewController
  ) {
  }

  ionViewDidLoad() {
    this.analitycs.registerPage('Register');
  }

  createUser() {
    this.profile['email'] = this.profile['login'];
    this.user.profileSignUp(this.profile)
      .then(r => {
        this.viewCtrl.dismiss('success');
      })
      .catch(e => {
        console.log('erro cadastro ->', e);
      })
  }

}
