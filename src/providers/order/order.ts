import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationProvider } from '../location/location';
import { NetworkProvider } from '../network/network';
import { ConstantsProvider } from '../constants/constants';

/*
  Generated class for the OrderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OrderProvider {

  constructor(
    private location: LocationProvider,
    private network: NetworkProvider,
    private c: ConstantsProvider
  ) { }

  async getZone() {
    try {
      return await this.location.getPosition()
    } catch (error) {
      throw error;
    }

  }

}
