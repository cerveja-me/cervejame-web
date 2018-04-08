import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NetworkProvider } from '../network/network';
import { DeviceProvider } from '../device/device';
import { Storage } from '@ionic/storage';

@Injectable()
export class UserProvider {

  constructor(private network: NetworkProvider,
    public device: DeviceProvider,
    private storage: Storage) {

  }

  profileLogin(p) {
    return new Promise((resolve, reject) => {
      this.device.getDevice()
        .then(d => {
          p.device_id = d['id'];
          this.network.post(this.network.c.AUTH, p)
            .then(t => {
              // this.device.oneSignal.syncHashedEmail(p.login);
              this.storage.set(this.network.c.AUTH, t['token']);
              resolve(t);
            })
            .catch(reject)
        })
        .catch(reject)
    })
  }

  profileSignUp(p) {
    return new Promise((resolve, reject) => {
      this.network.post(this.network.c.PROFILE, p)
        .then(res => {
          // this.device.oneSignal.syncHashedEmail(p.login);
          resolve(this.profileLogin(p));
          // this.device.oneSignalTag('name', p.name)
        })
        .catch(reject)
    })
  }

  facebookData() {
    return new Promise((resolve, reject) => {
      let permissions = new Array();
      permissions = ["public_profile", "email"];
      // this.fb.login(permissions)
      //   .then(data => {
      //     let params = new Array();
      //     this.fb.api("/me?fields=id,name,email,first_name,last_name,gender", params)
      //       .then(user => {
      //         user.auth = data.authResponse;
      //         resolve(user);
      //       })
      //       .catch(e => {
      //         reject(e);
      //       });
      //   })
      //   .catch(reject);
    })
  }

  facebookRegister() {
    return new Promise((resolve, reject) => {
      this.facebookData()
        .then(fu => {
          let u = {
            name: fu['name'],
            email: fu['email'],
            password: fu['id'],
            facebook_id: fu['id'],
            facebook_token: fu['auth']['accessToken'],
            login: fu['id'],
            photo: '',
            phone: '',
            type: 2,
            status: 1
          }

          this.profileLogin({ login: fu['id'], password: fu['id'] })
            .then(res => {
              resolve(res);
            })
            .catch(e => {
              this.profileSignUp(u)
                .then(re => {
                  resolve(re);
                })
                .catch(e => {
                  //tratar erro com o login
                  reject(e);
                })
            });
        })
        .catch(reject);
    });
  }

  isAuth() {
    return new Promise((resolve, reject) => {
      this.storage.get(this.network.c.AUTH)
        .then(t => {
          if (t) {
            resolve(true)
          } else {
            reject(false)
          }
        })
    })
  }

  costumerUpdate(phone) {
    return new Promise((resolve, reject) => {
      let u = {
        phone: phone
      }
      this.network.post(this.network.c.USER, u)
        .then(data => {
          this.updateCostumerData();
          resolve(data);
        })
        .catch(e => {
          reject(e);
        })
    })
  }

  getCostumerData(fromcache) {
    return new Promise((resolve, reject) => {
      this.storage.get(this.network.c.USER)
        .then(c => {
          if (c && c['code'] && c['time'] && fromcache) {
            resolve(c);
            // this.device.oneSignalTag('name', c.name)
            // this.device.oneSignalTag('sales', c['sales'])
          } else {
            // this.network.get(this.network.c.USER)
            //   .then(co => {
            //     co['time'] = new Date();
            //     this.storage.set(this.network.c.USER, co);
            //     resolve(co);
            // this.device.oneSignalTag('name', co['name'])
            // this.device.oneSignalTag('sales', co['sales'])
            // })
            // .catch(e => {
            //   reject(e);
            // })
          }
        })
    })
  }

  updateCostumerData() {
    this.network.get(this.network.c.USER)
      .then(co => {
        this.storage.set(this.network.c.USER, co);
        // this.device.oneSignalTag('name', co['name'])
        // this.device.oneSignalTag('sales', co['sales'])
      })
      .catch(e => {
        console.log(e);
      })

  }
}
