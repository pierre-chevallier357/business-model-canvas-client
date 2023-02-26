import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  currentLang: string = '';

  constructor(private translateService: TranslateService) {
    this.translateService.onLangChange.subscribe((lang) => {
      this.currentLang = lang.lang;
    });
    this.currentLang = this.translateService.currentLang;
  }
}
