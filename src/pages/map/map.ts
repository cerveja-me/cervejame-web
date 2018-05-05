import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CheckoutPage } from '../checkout/checkout';
import { LocationProvider } from '../../providers/location/location';
import { OrderProvider } from '../../providers/order/order';
import { AnalyticsProvider } from '../../providers/analytics/analytics';

declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;// =new google.maps.Map(this.mapElement.nativeElement, mapOpt);
  address;
  fulladdress;
  addressOptions = [];
  complement = '';
  number = '';
  loader;
  texting: boolean = false;
  oldLoc: any = {};
  originalMapCenter: any = {};
  movingPin = false;
  closing;
  editingAddress;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private location: LocationProvider,
    private order: OrderProvider,
    private zone: NgZone,
    private analitycs: AnalyticsProvider
  ) {
  }


  ionViewDidLoad() {
    this.analitycs.registerPage("Map");
    this.loadMap();
  }

  async getaddress() {
    // console.log('ionViewDidLoad MapPage', await this.location.getAddress());
  }

  async loadMap() {
    try {
      const mapOpt = await this.location.getMap();
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOpt);
      this.updateAddress({ 0: this.map.getCenter().lat(), 1: this.map.getCenter().lng() });
      this.map.addListener('dragstart', () => {
        this.movingPin = true;
        this.zone.run(() => { });
      }, err => {
        console.log(err);
      });
      this.map.addListener('dragend', () => {
        this.movingPin = false;
        this.updateAddress({ 0: this.map.getCenter().lat(), 1: this.map.getCenter().lng() });
        this.analitycs.registerEvent('moved_pin', {});
      }, err => {
        console.log(err);
      });

      var centerControlDiv = document.createElement('div');
    } catch (error) {

    }
  }

  centerControl(controlDiv, map, geo) {
    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = 'none';
    //  controlUI.style.border = '2px solid #fff';
    //  controlUI.style.borderRadius = '3px';
    //  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    //  controlUI.style.marginBottom = '20px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = '';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '';
    controlText.style.lineHeight = '';
    controlText.style.paddingLeft = '';
    controlText.style.paddingRight = '';
    controlText.innerHTML = '<span class="icon-location"></span>';
    controlUI.appendChild(controlText);

    controlUI.addEventListener('click', function () {
      map.setCenter({ lat: geo.latitude, lng: geo.longitude });
      google.maps.event.trigger(map, 'dragend');
    });

  }


  async updateAddress(_loc) {
    try {
      this.address = await this.location.getAddressFromLocation(_loc)
      this.fulladdress = this.address['route'];
      this.number = this.address['street_number'];
      if (this.number && this.number.includes('-')) {
        this.number = '';
      }
      // this.zone.run(() => { });
      this.order.updateLocationAddress(_loc, this.fulladdress, this.number, this.complement);

    } catch (error) {
      console.log('err->', error);

    }
  }

  async addressChange() {
    if (this.fulladdress.length > 3) {
      let v = this.navCtrl.getActive();
      this.addressOptions = await this.location.getLocationsFromAddress(this.fulladdress, null)
    }
  }


  async setAddress(address) {
    let add = await this.location.convertAddress(address);
    this.address.route = add['route'];
    this.fulladdress = add['route'];
    this.number = add['street_number'];
    this.closeEdit();

    setTimeout(() => {
      this.map.setCenter(new google.maps.LatLng(address.geometry.location.lat, address.geometry.location.lng));
      this.fulladdress = add['route'];
    }, 500);
    this.addressOptions = [];

  }

  closeEdit() {
    this.fulladdress = this.address['route'];
    // if (this.platform.is('cordova')) {
    //   let activeElement = <HTMLElement>document.activeElement;
    //   activeElement && activeElement.blur && activeElement.blur();
    // }
    this.editingAddress = false;
  }

  finishOrder() {
    this.order.updateLocationAddress({ 0: this.map.getCenter().lat(), 1: this.map.getCenter().lng() }, this.fulladdress, this.number, this.complement);
    this.navCtrl.push(CheckoutPage);
    this.analitycs.registerEvent('confirm_address', {});
  }
  async registerChanges(ev) {
    this.analitycs.registerEvent(ev, {});
  }
}
