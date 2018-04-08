import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AnalyticsProvider {

  constructor(public http: HttpClient) {
    console.log('Hello AnalyticsProvider Provider');
  }

  registerPage(page) {
    console.log('page -> ', page);
    //TODO:
    // google analitycs
    // facebook pixel
    // hotjar

  }

  registerEvent(event, o) {

  }



}
