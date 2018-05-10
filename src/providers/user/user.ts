import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NetworkProvider } from '../network/network';
import { DeviceProvider } from '../device/device';
import { StorageProvider } from '../storage/storage';

@Injectable()
export class UserProvider {

  constructor(
    private network: NetworkProvider,
    public device: DeviceProvider,
    private storage: StorageProvider) {

  }

  async profileLogin(p) {
    try {
      let d = await this.device.getDevice()
      p.device_id = d['id'];
      const t = await this.network.post(this.network.c.AUTH, p)
      this.storage.set(t['token'], this.network.c.AUTH);
      return t;          // this.device.oneSignal.syncHashedEmail(p.login);
    } catch (error) {
      throw error;
    }
  }

  async profileSignUp(p) {
    try {
      await this.network.post(this.network.c.PROFILE, p)
      return this.profileLogin(p);
    } catch (error) {
      throw error
    }
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

  async isAuth() {
    try {
      await this.storage.get(this.network.c.AUTH)
      return true
    } catch (error) {
      throw error
    }
  }

  async costumerUpdate(phone) {
    let u = {
      phone: phone
    }
    try {
      let data = await this.network.post(this.network.c.USER, u)
      await this.updateCostumerData();
      return data;
    } catch (error) {
      throw error
    }
  }

  async retrieveCostumerData() {
    try {
      let co = await this.network.get(this.network.c.USER);
      co['time'] = new Date();
      this.storage.set(co, this.network.c.USER);
      return co
    } catch (e) {
      throw e
    }
  }
  async getCostumerData(fromcache) {
    try {
      await this.isAuth()
    } catch (error) {
      return null
    }
    try {
      const c = await this.storage.get(this.network.c.USER)
      if (c && c['code'] && c['time'] && fromcache) {
        return c;
      } else {
        return this.retrieveCostumerData();
      }
    } catch (error) {
      return this.retrieveCostumerData();
    }

  }

  async updateCostumerData() {
    try {
      const co = await this.network.get(this.network.c.USER)
      this.storage.set(this.network.c.USER, co);
      return
    } catch (error) {
      console.log(error)
    }
  }
}
