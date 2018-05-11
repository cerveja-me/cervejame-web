import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

declare var FB;

@Injectable()
export class FacebookProvider {

  constructor(public http: HttpClient) {
    FB.init({
      appId: '339667689763204',
      cookie: true,
      xfbml: true,
      version: 'v3.0'
    });
    FB.AppEvents.logPageView();
  }


 async fbLogin() {
    return new Promise((resolve, reject) => {
      FB.getLoginStatus(function (r) {
        if (r.status && r.status ==='connected' && r.authResponse) {
          FB.api('/me?fields=id,name,email,first_name,last_name,gender', function (response) {
            response.photo = "https://graph.facebook.com/" + response.id + "/picture?type=square";
            response.auth = r.authResponse;
            resolve(response);
          });
        } else {
          FB.login(function (r) {
            if (r.authResponse) {
              FB.api('/me?fields=id,name,email,first_name,last_name,gender', function (response) {
                response.photo = "https://graph.facebook.com/" + response.id + "/picture?type=square";
                response.auth = r.authResponse;
                resolve(response);
              });
            } else {
              reject('User cancelled login or did not fully authorize.');
            }
          });
        }
      });
    });
  }
}
