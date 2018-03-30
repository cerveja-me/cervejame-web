import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

@Injectable()
export class LocationProvider {

  constructor(
    private geolocation: Geolocation
  ) {
    console.log('Hello LocationProvider Provider');
  }

  async getPosition() {
    try {
      // throw new Error('USER_DENIED_GEOLOCATION')
      // return await this.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 7000, maximumAge: 0 });
      return { latitude: -23.529338, longitude: -46.679942 }
    } catch (error) {
      throw new Error('USER_DENIED_GEOLOCATION')
    }


  }


}
