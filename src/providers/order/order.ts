import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationProvider } from '../location/location';
import { NetworkProvider } from '../network/network';
import { ConstantsProvider } from '../constants/constants';
import { DeviceProvider } from '../device/device';

/*
  Generated class for the OrderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OrderProvider {

  constructor(
    private location: LocationProvider,
    private net: NetworkProvider,
    private c: ConstantsProvider,
    private device: DeviceProvider
  ) { }

  locale;

  async getZone() {
    try {
      const pos = await this.location.getPosition()
      const dev = await this.device.getDevice();
      const day = new Date();
      const p = {
        id_device: dev['id'],
        position_gps: pos['latitude'] + ',' + pos['longitude'],
        time: day
      }
      const locality = await this.net.post(this.c.LOCATION, p)
      if (locality['zone']) {
        if (locality['zone']['products']) {
          this.locale = locality;
          return this.locale
        } else {
          throw 'NO_PRODUCTS'
        }
      } else {
        throw 'NO_ZONE_AVAILABLE'
      }
    } catch (error) {
      throw error;
    }
  }
}
