import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  set<T>(key: string, value: T) {
    try {
      const serializesValue = JSON.stringify(value);
      localStorage.setItem(key, serializesValue);
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }
}
