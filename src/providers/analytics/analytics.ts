import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

declare var hj;
declare var gtag;


@Injectable()
export class AnalyticsProvider {

  constructor(public http: HttpClient) {
    console.log('Hello AnalyticsProvider Provider');
  }

  registerPage(page) {
    gtag('config', 'UA-98118780-2', {
      'page_title': page,
      'page_path': '/'+page
    });
    hj('stateChange', page);
    // console.log('page -> ', page);
    //TODO:

    // facebook pixel



  }

  registerEvent(name, o) {
    gtag('event', name, o);
  }

  registerError(event, e){
    gtag('event', 'exception', {
      'description': e,
      'fatal': false
    });
  }

}
