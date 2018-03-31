import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class StorageProvider {

  constructor(private storage: Storage) { }

  async set(obj, label) {
    return await this.storage.set(label, obj);
  }

  async get(label) {
    try {
      const obj = await this.storage.get(label)
      if (obj) {
        return obj
      } else {
        throw 'NOT_FOUND'
      }
    } catch (error) {
      throw error
    }
  }
}
