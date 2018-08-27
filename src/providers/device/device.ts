import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageProvider } from '../storage/storage';
import { ConstantsProvider } from '../constants/constants';
import { UUID } from 'angular2-uuid';
import { NetworkProvider } from '../network/network';
import { Platform, Events, AlertController } from 'ionic-angular';
import * as CTS from '../cts';
import { Device } from '@ionic-native/device';
import { OneSignal } from '@ionic-native/onesignal';


@Injectable()
export class DeviceProvider {
  dev: {};
  isApp;
  constructor(
    private storage: StorageProvider,
    private c: ConstantsProvider,
    private net: NetworkProvider,
    public platform: Platform,
    private device : Device,
    private oneSignal: OneSignal,
    private events: Events,
    private alertCtrl: AlertController

  ) { }

  async createDevice(push: string) {
    var d = {
      id: '',
      push_token: push || 'empty',
      app_version: CTS.version.appVersion,
      app_name: CTS.mobile?1:4, //web browser
      app_os: CTS.mobile?'':'browser',
      phone_model: CTS.mobile ? this.device.platform:'browser web',
      device_uuid: CTS.mobile?this.device.uuid:'2b1291aa-5731-4741-9877-db2b77cc603c',
      install_uuid: await this.getInstallUUID()
    }
    try {
      this.dev = await this.net.post(this.c.DEVICE, d)
      return this.dev
    } catch (error) {
      throw error
    }
  }

  async getDevice() {
    if (this.dev) {
      return this.dev
    }
    return await this.createDevice('');
  }

  //create instalation ID
  async getInstallUUID() {
    try {
      return await this.storage.get(this.c.INSTALL_UUID)
    } catch (e) {
      if (e === 'NOT_FOUND') {
        let uuid = UUID.UUID();
        await this.storage.set(uuid, this.c.INSTALL_UUID);
        return this.getInstallUUID();
      } else {
        throw e
      }
    }
  }

  async firstTime() {
    try {
      return await this.storage.get(this.c.FIRST_TIME)
    } catch (e) {
      return true
    }
  }

  createAlertPush(title, body) {
    let alert = this.alertCtrl.create({
      title: title,
      message: body,
      buttons: ['Ok']
    });
    // this.registerEvent('notification_clicked', { 'title': title, 'body': body });
    alert.present();
  }

  startOneSignal() {
    var settings: any = { kOSSettingsKeyAutoPrompt: false };
    this.oneSignal.iOSSettings(settings);
    this.oneSignal.startInit('5d5587e7-348c-4172-8a19-7e01c49daa2a', '10339294539');
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);

    this.oneSignal.handleNotificationReceived()
      .subscribe((text) => {
        if (text.payload['additionalData']) {
          this.events.publish(text.payload['additionalData']['action'], 'update');
        }
        this.createAlertPush(text.payload['title'], text.payload['body'])
      });
    this.oneSignal.handleNotificationOpened()
      .subscribe((text) => {
        if (text.notification.payload['additionalData']) {
          this.events.publish(text.notification.payload['additionalData']['action'], 'update');
        }
        // this.registerEvent('notification_opened', text.notification);
      });
    this.oneSignal.getIds()
      .then(res => {
        this.createDevice(res.userId);
      })
    this.oneSignal.endInit();
  }
  startPush() {
    if (this.platform.is('cordova')) {
      this.oneSignal.registerForPushNotifications();
      this.oneSignal.getIds()
        .then(res => {
          // this.firebase.getToken()
          //   .then(token => console.log(`The token is ${token}`)) // save the token server-side and use it to push notifications to this device
          //   .catch(error => console.error('Error getting token', error));
          // this.firebase.onTokenRefresh()
          //   .subscribe((token: string) => console.log(`Got a new token ${token}`));

          this.createDevice(res.userId);
        })
    }
  }

  oneSignalTag(tag: string, zone: string) {
    if (this.platform.is('cordova')) {
      this.oneSignal.sendTag(tag, zone);
      // this.firebase.setUserProperty(tag, zone);
    }
  }
}
