import { Injectable } from '@angular/core';

@Injectable()
export class PreferencesService {

  constructor(private storage: Storage) { }

  save(key: string, value: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.storage.setItem(key, value);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  get(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.storage.getItem(key));
      } catch (e) {
        reject(e);
      }
    });
  }

  async getAll<S extends string>(keys: S[]): Promise<{ [K in S]: string }> {
    return new Promise(async (resolve, reject) => {
      const values: any = {};
      try {
        for (const key of keys) {
          values[key] = await this.get(key);
        }

        resolve(values);
      } catch (e) {
        reject(e);
      }
    });
  }
}
