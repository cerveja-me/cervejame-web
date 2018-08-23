import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsProvider } from '../constants/constants';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

import 'rxjs/add/operator/map';

declare var FB;

@Injectable()
export class FacebookProvider {

  constructor(
    public http: HttpClient,
    private c: ConstantsProvider,
    private fb: Facebook
  ) {
    if (c.IS_MOBILE) {

    } else {
      this.initWeb();
    }
  }

  initMobile() {

  }

  initWeb() {
    FB.init({
      appId: this.c.FB_APP_ID,
      cookie: true,
      xfbml: true,
      version: 'v3.0'
    });
    FB.AppEvents.logPageView();
  }

  async fbLogin() {
    if (this.c.IS_MOBILE) {
      return this.fbLoginMobile();
    } else {
      return this.fbLoginWeb();
    }
  }

  async fbLoginWeb(): Promise<any> {
    return new Promise((resolve, reject) => {
      FB.getLoginStatus(function (r) {
        if (r.status && r.status === 'connected' && r.authResponse) {
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

  fbLoginMobile(): Promise<any> {
    let permissions = ["public_profile", "email"];
    let d: any;
    return this.fb.login(permissions)
      .then(data => {
        d = data;
        return this.fb.api("/me?fields=id,name,email,first_name,last_name,gender", new Array());
      })
      .then(user => {
        user.auth = d.authResponse;
        return user;
      })
      .catch(e => {
        throw e;
      });
  }
}
