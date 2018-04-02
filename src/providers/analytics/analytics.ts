import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AnalyticsProvider {

  constructor(public http: HttpClient) {
    console.log('Hello AnalyticsProvider Provider');
  }

  registerEvent(event, o) {

  }


}
