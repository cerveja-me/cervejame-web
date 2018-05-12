import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

declare var hj;


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
    hj('stateChange', page);

  }

  registerEvent(event, o) {
    console.log('event ->', event, o)
  }



}
