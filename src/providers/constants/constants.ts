import { Injectable } from '@angular/core';
import * as CTS from '../cts';

@Injectable()
export class ConstantsProvider {
  public API: string = CTS.env.server_url;
  public FB_APP_ID: string = CTS.env.fb_id;
  public IS_MOBILE: boolean= CTS.mobile;

  public FB_VERSION: string = '3.0'
  public DEVICE: string = 'device/';
  public LOCATION: string = 'location/';
  public PROFILE: string = 'profile/';
  public SALE: string = 'sale/v2/';
  public VOUCHER: string = 'voucher/';
  public AUTH: string = this.PROFILE + 'auth/';
  public RATE: string = 'rate/';
  public USER: string = 'costumer/';
  public REMOTE_ASSETS: string = 'https://s3-sa-east-1.amazonaws.com/assests.cerveja.me';
  public INSTALL_UUID: string = 'install_uuid';
  public APP_VERSION: string = '1.0.0';
  public FIRST_TIME: string = 'firsttime';
  public AGE_CONFIRMED: string = 'age_confirmation';


  GOOGLE_GEOCODE: string = 'https://maps.googleapis.com/maps/api/geocode/json?address=#&location=LAT,LNG&rankby=distance&key=AIzaSyCviMvRgOLra4U-obeRi33K0Cur5WlGTQg';
  GOOGLE_ADDRESS: string = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=#&key=AIzaSyCviMvRgOLra4U-obeRi33K0Cur5WlGTQg';
}
