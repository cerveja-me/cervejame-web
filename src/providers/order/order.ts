import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationProvider } from '../location/location';
import { NetworkProvider } from '../network/network';
import { ConstantsProvider } from '../constants/constants';
import { DeviceProvider } from '../device/device';


@Injectable()
export class OrderProvider {
  locale: any;
  voucher;
  sale = {
    id: '',
    icebox: []
  }

  constructor(
    private location: LocationProvider,
    private net: NetworkProvider,
    private c: ConstantsProvider,
    private device: DeviceProvider
  ) { }



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

  async updateLocationAddress(loc, address, number, complement) {
    const up = {
      position_maps: loc[0] + "," + loc[1],
      street: address,
      num: number,
      complement: complement
    }
    this.locale['number'] = number;
    this.locale['complement'] = complement;

    try {
      this.locale = await this.net.put(this.net.c.LOCATION + this.locale['id'], up)
    } catch (error) {
      console.log('erro no put -> ', error);
    }
  }

  getLocale() {
    return this.locale;
  }

  setVoucher(voucher) {
    this.voucher = voucher;
  }

  getVoucher() {
    return this.voucher;
  }

  removeVoucher() {
    this.voucher = null;
  }

  setItems(icebox) {
    this.sale.icebox = icebox
  }

  getSale() {
    return this.sale;
  }

  async createOrder() {
    try {
      let sale = await this.net.post('', '')
    } catch (error) {

    }
  }
}
// async  completeOrder(){
//     try {
//       let sale = await this.net.post()
//     } catch (error) {

//     }
//   }
// }
