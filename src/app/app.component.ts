import {Component, isDevMode} from '@angular/core';

import { Configuration, OpenAIApi } from "openai";
import {environment} from "../environments/environment";

const hasOwnPropFailSafe = (obj: any, prop: string) => {
  return obj.hasOwnProperty(prop) ? obj[prop] : '';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  openai!: OpenAIApi;
  title = 'dall-e';
  imageSearch = '';
  numberOfImages?: number;
  openAIImageResults: string[] = [];
  apiKey?: string = hasOwnPropFailSafe(environment, 'openAIKey')
  fetchingImages = false;
  errorCallingAPI?: unknown;

  constructor() {
    if (this.apiKey) {
      const configuration = new Configuration({
        apiKey: this.apiKey
      });

      this.openai = new OpenAIApi(configuration);
    }
  }

  get disabledButtonState(): boolean {
    const parsedNumberOfImages = parseInt(this.numberOfImages?.toString() || '');

    return !this.imageSearch.length ||
      (typeof this.numberOfImages !== "number"
        || !(parsedNumberOfImages > 0 && parsedNumberOfImages < 6));
   }

  async generateImage() {
    this.fetchingImages = true;

    try {
      const result = await this.openai.createImage({
        prompt: this.imageSearch,
        n: this.numberOfImages,
        size: '512x512'
      });

      this.openAIImageResults = result.data.data.map(e => e.url) as string[];
      this.errorCallingAPI = undefined;
    } catch (e: unknown) {
      this.errorCallingAPI = e;
      console.log('e', e)
    } finally {
      this.fetchingImages = false;
    }
  }

  addEmoji($event: any) {
    console.log('EMOJIJ ', $event.emoji.native)

  }
}
