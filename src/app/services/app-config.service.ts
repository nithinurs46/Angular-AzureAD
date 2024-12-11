import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private config: any;
  private httpClient: HttpClient;
  constructor(handler: HttpBackend) {
    this.httpClient = new HttpClient(handler);
  }

  async loadConfig(): Promise<any> {
    try {
      const data = await firstValueFrom(this.httpClient.get('/assets/config/config.json'));
      this.config = data;
      return data;
    } catch (error) {
      console.error('Error loading config:', error);
      throw error;
    }
  }

  getConfig(): any {
    return this.config;
  }
}
