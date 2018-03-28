import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsProvider } from '../constants/constants';
import { Storage } from '@ionic/storage';

/*
  Generated class for the NetworkProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NetworkProvider {

  constructor(
    public http: HttpClient,
    public c: ConstantsProvider,
    private storage: Storage
  ) {
    console.log('Hello NetworkProvider Provider');
  }

}
