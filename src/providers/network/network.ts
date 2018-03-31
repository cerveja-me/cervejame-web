import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsProvider } from '../constants/constants';
import { StorageProvider } from '../storage/storage';

@Injectable()
export class NetworkProvider {

  constructor(
    public http: HttpClient,
    public c: ConstantsProvider,
    private storage: StorageProvider
  ) {
    console.log('Hello NetworkProvider Provider');
  }

  async post(endpoint, d) {
    let h: HttpHeaders;
    try {
      const token = await this.storage.get('token')
      h = new HttpHeaders()
        .append('Content-Type', 'application/json')
        .append('Authorization', 'Bearer ' + token)
    } catch (error) {
      h = new HttpHeaders()
        .append('Content-Type', 'application/json')
    }
    return new Promise((resolve, reject) => {
      this.http.post(this.c.API + endpoint, JSON.stringify(d), { headers: h })
        .subscribe(r => {
          resolve(r)
        }, err => {
          reject(err)
        })
    })

  }



}
