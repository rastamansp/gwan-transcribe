import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import axios, { AxiosResponse } from 'axios';
import { expect } from 'chai';

export interface TestWorld extends World {
  baseUrl: string;
  response: AxiosResponse | null;
  requestData: any;
  authToken: string | null;
  userId: string | null;
  expect: typeof expect;
  makeRequest(method: string, endpoint: string, data?: any, headers?: any): Promise<void>;
  get(endpoint: string, headers?: any): Promise<void>;
  post(endpoint: string, data?: any, headers?: any): Promise<void>;
  put(endpoint: string, data?: any, headers?: any): Promise<void>;
  delete(endpoint: string, headers?: any): Promise<void>;
  getAuthHeaders(): any;
  setAuthToken(token: string): void;
  clearAuthToken(): void;
  setUserId(id: string): void;
  getResponseStatus(): number;
  getResponseData(): any;
  getResponseHeaders(): any;
}

export class CustomWorld extends World implements TestWorld {
  public baseUrl: string;
  public response: AxiosResponse | null;
  public requestData: any;
  public authToken: string | null;
  public userId: string | null;
  public expect: typeof expect;

  constructor(options: IWorldOptions) {
    super(options);
    this.baseUrl = 'http://localhost:3000/api/v1';
    this.response = null;
    this.requestData = {};
    this.authToken = null;
    this.userId = null;
    this.expect = expect;
  }

  async makeRequest(method: string, endpoint: string, data?: any, headers?: any): Promise<void> {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      method,
      url,
      data,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    try {
      this.response = await axios(config);
    } catch (error: any) {
      this.response = error.response;
    }
  }

  async get(endpoint: string, headers?: any): Promise<void> {
    await this.makeRequest('GET', endpoint, undefined, headers);
  }

  async post(endpoint: string, data?: any, headers?: any): Promise<void> {
    await this.makeRequest('POST', endpoint, data, headers);
  }

  async put(endpoint: string, data?: any, headers?: any): Promise<void> {
    await this.makeRequest('PUT', endpoint, data, headers);
  }

  async delete(endpoint: string, headers?: any): Promise<void> {
    await this.makeRequest('DELETE', endpoint, undefined, headers);
  }

  getAuthHeaders(): any {
    if (!this.authToken) {
      return {};
    }
    return {
      'Authorization': `Bearer ${this.authToken}`
    };
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  clearAuthToken(): void {
    this.authToken = null;
  }

  setUserId(id: string): void {
    this.userId = id;
  }

  getResponseStatus(): number {
    return this.response?.status || 0;
  }

  getResponseData(): any {
    return this.response?.data || {};
  }

  getResponseHeaders(): any {
    return this.response?.headers || {};
  }
}

setWorldConstructor(CustomWorld); 