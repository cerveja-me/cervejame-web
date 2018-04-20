import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, AlertController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { ModalRegisterPage } from '../modal-register/modal-register';
import { AnalyticsProvider } from '../../providers/analytics/analytics';

/**
 * Generated class for the ModalLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-modal-login',
  templateUrl: 'modal-login.html',
})
export class ModalLoginPage {
  profile: any = {
    login: null,
    password: null
  };

  constructor(
    private user: UserProvider,
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private analitycs: AnalyticsProvider
  ) {
  }


  ionViewDidLoad() {
    this.analitycs.registerPage("Login");
  }

  doLoginForm() {
    this.user.profileLogin(this.profile)
      .then(res => {
        this.viewCtrl.dismiss('success');
      })
      .catch(e => {
        let prompt = this.alertCtrl.create({
          title: 'Dados Inválidos!',
          message: 'Parece que você errou sua senha, cuidado quando for utilizar o aplicativo enquanto estiver alcoolizado.',
          buttons: [
            {
              text: 'Tentar de novo',
              handler: data => {

                this.analitycs.registerEvent('login_error_try_again', this.profile);
              }
            },
            {
              text: 'Cadastrar-se',
              handler: data => {
                this.openModalRegister();
                this.analitycs.registerEvent('login_error_register', this.profile);
              }
            },
            {
              text: 'Entrar com Facebook',
              handler: data => {
                this.doFacebookRegister();
                this.analitycs.registerEvent('login_error_Facebook_login', this.profile);
              }
            }
          ]
        }).present();
        this.analitycs.registerEvent('login_error', this.profile);
        console.log('erro -> ', e);
      })
  }

  openModalRegister() {
    this.analitycs.registerEvent('register', this.profile);
    let modal = this.modalCtrl.create(ModalRegisterPage);
    modal.present();
    modal.onDidDismiss(data => {
      if (data === 'success') {
        this.viewCtrl.dismiss('success');
      } else {
        this.analitycs.registerPage('Login');
      }
    });
  }

  doFacebookRegister() {
    // this.loader=this.load.create({content: this.device.getRandonLoading()});
    // this.loader.present();
    this.user.facebookRegister()
      .then(u => {
        // this.loader.dismiss();
        this.viewCtrl.dismiss('success');
      })
      .catch(e => {
        console.log('error face-> ', e);
        // this.user.device.logError(e);
        // this.dismiss('success');
      });
  }


}
