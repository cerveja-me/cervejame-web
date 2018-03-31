import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageProvider } from '../storage/storage';
import { ConstantsProvider } from '../constants/constants';
import { UUID } from 'angular2-uuid';
import { NetworkProvider } from '../network/network';


@Injectable()
export class DeviceProvider {
  dev: {};
  constructor(
    private storage: StorageProvider,
    private c: ConstantsProvider,
    private net: NetworkProvider
  ) {
    console.log('Hello DeviceProvider Provider');
  }

  async createDevice(push: string) {
    var d = {
      id: '',
      push_token: push || 'empty',
      app_version: this.c.APP_VERSION,
      app_name: 4, //web browser
      app_os: 'browser',
      phone_model: 'browser web',
      device_uuid: '2b1291aa-5731-4741-9877-db2b77cc603c',
      install_uuid: await this.getInstallUUID()
    }
    try {
      this.dev = await this.net.post(this.c.DEVICE, d)
      return this.dev
    } catch (error) {
      throw error
    }
  }

  async getDevice() {
    if (this.dev) {
      return this.dev
    }
    return await this.createDevice('');
  }

  //create instalation ID
  async getInstallUUID() {
    try {
      return await this.storage.get(this.c.INSTALL_UUID)
    } catch (e) {
      if (e === 'NOT_FOUND') {
        let uuid = UUID.UUID();
        await this.storage.set(uuid, this.c.INSTALL_UUID);
        return this.getInstallUUID();
      } else {
        console.log('ERRRORUUUU -> ', e);
      }
    }
  }
}
