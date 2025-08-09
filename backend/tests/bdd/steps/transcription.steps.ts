import { Given, When, Then } from '@cucumber/cucumber';
import { TestWorld } from '../world/world';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as FormData from 'form-data';

When('eu faço upload de transcrição com arquivo {string} e idioma {string}', async function (this: TestWorld, relativePath: string, language: string) {
  const filePath = path.resolve(process.cwd(), relativePath);
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  form.append('language', language);

  try {
    const res = await axios.post(`${this.baseUrl}/transcription/upload`, form, {
      headers: {
        ...form.getHeaders(),
        ...this.getAuthHeaders(),
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });
    this.response = res as any;
  } catch (error: any) {
    this.response = error.response;
  }
});

When('eu faço upload de transcrição com arquivo {string}', async function (this: TestWorld, relativePath: string) {
  const filePath = path.resolve(process.cwd(), relativePath);
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  try {
    const res = await axios.post(`${this.baseUrl}/transcription/upload`, form, {
      headers: {
        ...form.getHeaders(),
        ...this.getAuthHeaders(),
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });
    this.response = res as any;
  } catch (error: any) {
    this.response = error.response;
  }
});

Then('eu salvo o id da transcrição retornada', function (this: TestWorld) {
  const data = this.getResponseData();
  const id = data?.data?.id || data?.id;
  this.expect(id).to.be.a('string');
  this.setUserId(id);
});

When('eu busco a transcrição pelo último id', async function (this: TestWorld) {
  const id = this.userId;
  this.expect(id).to.be.a('string');
  await this.get(`/transcription/${id}`, this.getAuthHeaders());
});


