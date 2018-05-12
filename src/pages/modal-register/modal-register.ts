import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
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
    private viewCtrl: ViewController,
    private alertCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {
    this.analitycs.registerPage('Register');
  }

  showCreateError(){
    this.alertCtrl.create({
      title:'Erro ao Cadastrar!',
      message:'O email informado já esta sendo utilizado, se achar que isso é um erro por favor nos comunique contato@cerveja.me',
      buttons:['ok']
    }).present()
  }
  async createUser() {
    try {
      this.profile['email'] = this.profile['login'];
      await this.user.profileSignUp(this.profile)
      this.viewCtrl.dismiss('success');
    } catch (error) {
      console.log('error -> ',error)
      switch(error.error.code){
        case 1005:
        this.showCreateError();
        default:

      }
    }
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
