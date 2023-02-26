import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(private translate: TranslateService) {}
  public language$: BehaviorSubject<string> = new BehaviorSubject<string>(
    this.translate.getBrowserLang() ?? 'fr'
  );
}
