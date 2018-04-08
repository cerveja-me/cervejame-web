import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';


@Component({
  selector: 'page-modal-schedule',
  templateUrl: 'modal-schedule.html',
})
export class ModalSchedulePage {
  hours = [];
  closed;
  day = new Date();
  time = this.day.getTime();
  weekday = this.day.getDay();

  constructor(
    public navCtrl: NavController, public navParams: NavParams, private order: OrderProvider
  ) {
  }



  ionViewDidLoad() {
    // this.order.device.camPage("schedule");

    this.hours = this.navParams.get('hours');
  }

}
