import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsProvider {
  public API: string = 'https://api2.cerveja.me/api/';
  //  public API:string='http://localhost:1337/ec2-54-207-94-27.sa-east-1.compute.amazonaws.com/api/';
  //  public API:string='http://10.42.0.1:9001/api/';
  // public API: string = 'http://999eb3d2.ngrok.io/api/';
  public DEVICE: string = 'device/';
  public LOCATION: string = 'location/';
  public PROFILE: string = 'profile/';
  public SALE: string = 'sale/';
  public VOUCHER: string = 'voucher/';
  public AUTH: string = this.PROFILE + 'auth/';
  public RATE: string = 'rate/';
  public USER: string = 'costumer/';
  public REMOTE_ASSETS: string = 'https://s3-sa-east-1.amazonaws.com/assests.cerveja.me';
  public INSTALL_UUID: string = 'install_uuid';
  public APP_VERSION: string = '1.0.0';
}
