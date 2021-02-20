import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { NetworkProvider } from '../network/network';
import { ConstantsProvider } from '../constants/constants';


declare var google;


@Injectable()
export class LocationProvider {
  address: any;

  constructor(
    private geolocation: Geolocation,
    private net: NetworkProvider,
    private c: ConstantsProvider
  ) {

  }

  // async getPosition() {
  //   try{
  //     if (this.c.IS_MOBILE) {
  //       return await this.getPositionMobile();
  //     } else {
  //       return await this.getPositionWeb();
  //     }
  //   }catch(e){
  //     throw e;
  //   }
    
  // }

  async getPositionMobile() {
    try {
      if (this.address && this.address.geometry && this.address.geometry.location && this.address.geometry.location.lat) {
        let l = this.address.geometry.location;
        return { latitude: l.lat, longitude: l.lng }
      } else {
        const pos = await this.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 7000, maximumAge: 0 });
        return pos.coords;
        // await this.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 7000, maximumAge: 0 })

        // return new Promise((resolve, reject) => {
        //   this.geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 7000, maximumAge: 0 })
        //     .then(pos => {
        //       resolve(pos.coords)
        //     })
        //     .catch(err => {
        //       let e: string = '';
        //       if (err.code == 1) {
        //         e = 'USER_DENIED_GEOLOCATION';
        //       } else {
        //         e = 'GEOLOCATION_TIMEOUT';
        //       }
        //       throw (e);
        //     })
        // })
      }
    } catch (error) {
      throw new Error('USER_DENIED_GEOLOCATION')
    }
  }

  async getPosition() {
    try {
      if (this.address && this.address.geometry && this.address.geometry.location && this.address.geometry.location.lat) {
        let l = this.address.geometry.location;
        return { latitude: l.lat, longitude: l.lng }
      } else {
        // return new Promise((resolve, reject) => {
         return this.geolocation.watchPosition({ enableHighAccuracy: true, timeout: 7000, maximumAge: 0 })
            .subscribe(position => {
              if (position['code'] === 1) {
                throw(new Error('USER_DENIED_GEOLOCATION'));
              }else  if (position['code'] === 2) {
                throw(new Error('NETWORK_ERROR'));
              } else if (position['code'] === 3) {
                throw(new Error('USER_DENIED_GEOLOCATION'));
              } else {
                return (position.coords)
              }
            }, e => {
              throw(new Error('USER_DENIED_GEOLOCATION'));
            })
        // })
      }
    } catch (error) {
      throw new Error('USER_DENIED_GEOLOCATION')
    }
  }

  async setAddress(address) {
    this.address = address;
  }

  async getAddress() {
    return this.address
  }

  async getAddressFromLocation(location) {
    try {
      let url = this.c.GOOGLE_ADDRESS.replace('#', location[0] + ',' + location[1]);
      const r = await this.net.externalGet(url)
      let add = r['results']
      return this.convertAddress(add[0]);
    } catch (error) {
      throw error
    }
  }

  async getLocationsFromAddress(address, location) {
    let url = this.c.GOOGLE_GEOCODE.replace('#', address);
    url = url.replace('LAT', location ? location.lat() : '-23.543254');
    url = url.replace('LNG', location ? location.lng() : '-46.688769');
    try {
      const r = await this.net.externalGet(url)
      if (r['status'] === "OK") {
        return r['results']
      }
    } catch (error) {
      console.log(error)
    }
  }

  async getMap() {
    let pos = await this.getPosition();
    let latLng = new google.maps.LatLng(pos['latitude'], pos['longitude']);
    var mapOptions = {
      clickableIcons: false,
      disableDoubleClickZoom: true,
      fullscreenControl: false,
      panControl: false,
      rotateControl: false,
      scaleControl: false,
      scrollwheel: false,
      signInControl: false,
      streetViewControl: false,
      zoomControl: false,
      mapTypeControl: false,
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: latLng
    }
    return mapOptions;
  }

  async convertAddress(place) {
    let componentForm = {
      street_number: 'short_name',
      route: 'long_name',
      locality: 'long_name',
      administrative_area_level_1: 'short_name',
      country: 'long_name',
      postal_code: 'short_name'
    };
    let address = {};
    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];
      if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType]];
        address[addressType] = val;
      }
    }
    address['formated'] = await this.formatAddress(address);
    return (address);
  }
  async formatAddress(address) {
    return address.route + ", " + address.street_number + ", " + address.locality + ", " + address.administrative_area_level_1;
  }



}
