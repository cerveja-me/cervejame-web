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
  }

  async post(endpoint, d) {
    let h: HttpHeaders;
    try {
      const token = await this.storage.get(this.c.AUTH)
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

  async get(endpoint) {
    let h: HttpHeaders = new HttpHeaders();
    try {
      const token = await this.storage.get(this.c.AUTH)
      h = new HttpHeaders()
        .append('Authorization', 'Bearer ' + token)
    } catch (error) {
      h = new HttpHeaders();
    }
    return new Promise((resolve, reject) => {
      this.http.get(this.c.API + endpoint, { headers: h })
        .subscribe(r => {
          resolve(r)
        }, err => {
          reject(err)
        })
    })
  }

  async put(endpoint, data) {
    let h: HttpHeaders = new HttpHeaders();
    try {
      const token = await this.storage.get(this.c.AUTH)
      h = new HttpHeaders()
        .append('Authorization', 'Bearer ' + token)
    } catch (error) {
      h = new HttpHeaders();
    }
    return new Promise((resolve, reject) => {
      this.http.put(this.c.API + endpoint, JSON.stringify(data), {
        headers: h
      })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }


  async externalGet(endpoint) {
    return new Promise((resolve, reject) => {
      this.http.get(endpoint)
        .subscribe(r => {
          resolve(r)
        }, err => {
          reject(err)
        })
    })
  }


}
