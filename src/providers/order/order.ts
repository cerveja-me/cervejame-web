import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationProvider } from '../location/location';
import { NetworkProvider } from '../network/network';
import { ConstantsProvider } from '../constants/constants';
import { DeviceProvider } from '../device/device';
import { UserProvider } from '../user/user';


@Injectable()
export class OrderProvider {
  locale: any;

  voucher;
  sale = {
    location: '',
    id: '',
    icebox: [],
    freight_value: 0,
    payment: null,
    voucher: null,
    friendRef: null
  }

  constructor(
    private location: LocationProvider,
    private net: NetworkProvider,
    private c: ConstantsProvider,
    private device: DeviceProvider,
    private user: UserProvider
  ) { }



  async getZone() {
    try {
      const pos = await this.location.getPosition();
      const dev = await this.device.getDevice();
      const day = new Date();
      const p = {
        id_device: dev['id'],
        position_gps: pos['latitude'] + ',' + pos['longitude'],
        time: day
      }
      const locality = await this.net.post(this.c.LOCATION, p)
      this.locale = locality;
      this.locale.address = await this.location.getAddressFromLocation({ 0: pos['latitude'], 1: pos['longitude'] });
      if (locality['zone']) {
        if (locality['zone']['products']) {
          if (!locality['zone']['free_shipping']) {
            this.sale.freight_value = locality['zone']['freight_value']
          }
          return this.locale
        } else {
          throw 'NO_PRODUCTS'
        }
      } else {
        throw {error:'NO_ZONE_AVAILABLE', address:this.locale.address};
      }
    } catch (error) {
      throw ({error:'NETWORK_ERROR'});
    }
  }

  async updateLocationAddress(loc, address, number, complement) {
    this.locale.number = number;
    this.locale.complement = complement;

    const day = new Date();
    const up = {
      position_maps: loc[0] + "," + loc[1],
      street: address,
      num: number,
      complement: complement,
      time: day
    }
    try {
      this.locale = await this.net.put(this.net.c.LOCATION + this.locale['id'], up)
      return
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

  setFriendRef(fr) {
    this.sale.friendRef = fr;
  }

  setItems(icebox) {
    this.sale.icebox = icebox
  }

  getSale() {
    return this.sale;
  }

  async createOrder() {
    try {
      this.sale.location = this.locale.id
      let sale: any = await this.net.post(this.c.SALE, this.sale)
      this.sale.id = sale.id;
    } catch (error) {
      console.log('erroc crair venda 0> ', error)
    }
  }

  async completeOrder() {
    try {
      this.sale.voucher = this.voucher;
      let sale = await this.net.put(this.c.SALE + this.sale.id, this.sale);
      return sale;
    } catch (error) {
      throw error.error
    }
  }

  async getOrders() {
    try {
      await this.user.isAuth()
      return await this.net.get(this.c.SALE)
    } catch (error) {
      //não
    }
  }
  async rateOrder(r) {
    try {
      let rate = {
        id_sale: r.id_sale,
        who: 2,
        rate: r.rate,
        comment: r.comment
      };
      return await this.net.post(this.c.RATE, rate)
    } catch (error) {

    }
  }


}
