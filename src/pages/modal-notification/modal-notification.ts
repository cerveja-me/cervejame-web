import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';


import { DeviceProvider } from '../../providers/device/device'

@Component({
  selector: 'page-modal-notification',
  templateUrl: 'modal-notification.html',
})
export class ModalNotificationPage {

  constructor(
    public viewCtrl:ViewController,
    private device:DeviceProvider
  ) {
  }

  ionViewDidLoad() {
    // this.device.camPage("notification");

  }

  accept(){
    this.device.startPush();
    setTimeout(() => {
      this.viewCtrl.dismiss();
    },300);
  }

}
