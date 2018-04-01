import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';
import { AnalyticsProvider } from '../../providers/analytics/analytics';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  products = [];
  location = {};
  @ViewChild(Slides) slides: Slides;
  taped = false;
  changingSlide = false;
  amount = 2;
  selectedBeer: any;
  // ASSETS: string = this.order.c.REMOTE_ASSETS;
  showTip = false;
  current = 0;
  loadedcompleted;
  err;
  discount = 0;
  updatingAmount;
  loader;
  actions: any = {
    accepted: null,
    onWay: null,
    finishedAt: null,
    review: null
  }
  openSale: any;
  constructor(
    public navCtrl: NavController,
    private order: OrderProvider,
    private analitycs: AnalyticsProvider,
    private zone: NgZone,

  ) {

  }

  ionViewDidLoad() {
    this.getZone();
  }


  async getZone() {
    try {
      const l = await this.order.getZone();
      console.log('l->', l);
      this.location = l;
      this.products = l['zone']['products'];
      console.log('prd', this.products)
      this.slideChanged();

    } catch (error) {
      this.err = error.message;
      console.log(error.message)
    }
    this.loadedcompleted = true;

  }

  tryAgain() {
    this.navCtrl.setRoot(HomePage);
    this.analitycs.registerEvent('try_again', {})
  }


  slideChanged() {
    let current = this.slides.getActiveIndex();
    if (this.products.length === current) {
      this.slides.slidePrev();
    } else {
      this.current = current;
      this.changingSlide = false;
      this.amount = 2;
      this.discount = 0.05;
      this.zone.run(() => { });
      // this.device.registerEvent('slide_change', this.products[current]);
      // TODO analitycs
      this.selectedBeer = {
        beer: this.products[current],
        discount: this.discount,
        amount: this.amount
      }
      this.updatePriceAndDiscount();
    }
  }

  updatePriceAndDiscount() {
    if (this.selectedBeer.beer.progressive_discount) {
      if (this.amount > 2) {
        this.discount = 0.1;
      } else {
        this.discount = (this.amount - 1) * 0.05;
      }

      this.selectedBeer.discount = this.discount;
      this.selectedBeer.amount = this.amount;
      let p = this.selectedBeer.beer.price * this.amount;
      let full = p;
      p = p - (p * this.discount);
      p = Math.round(p);
      this.selectedBeer.discount = 1 - (p / full);
      this.selectedBeer.finalDiscount = this.selectedBeer.discount * 100;
      this.selectedBeer.price = p;
      this.selectedBeer.unitValue = p / (this.selectedBeer.beer.amount * this.amount);
    } else {
      let p = this.selectedBeer.beer.price * this.amount;
      this.selectedBeer.discount = 0;
      this.selectedBeer.finalDiscount = 0;
      this.selectedBeer.price = p;
      this.selectedBeer.unitValue = p / (this.selectedBeer.beer.amount * this.amount);

    }
    this.zone.run(() => { });
  }

  onTaped(event) {
    this.taped = true;
    this.changingSlide = true;
  }
  increaseAmount() {
    this.updatingAmount = true;
    // this.device.registerEvent('increaseAmount',this.selectedBeer.beer)
    this.amount++;
    // this.device.registerEvent('increase_amount', this.selectedBeer.beer)
    this.updatePriceAndDiscount();
    setTimeout(() => {
      this.updatingAmount = false;
    }, 100);
  }

  decreaseAmount() {
    this.updatingAmount = true;
    // this.device.registerEvent('decrease_amount', this.selectedBeer.beer)

    if (this.amount > 1) {
      this.amount--;
      this.updatePriceAndDiscount();
    }
    setTimeout(() => {
      this.updatingAmount = false;
    }, 100);
  }
}
