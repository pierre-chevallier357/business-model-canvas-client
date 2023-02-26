import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CookiesConsentService {
  private answered = false;

  constructor(private cookieService: CookieService) {
    this.answered = this.cookieService.check('HAS_ACCEPTED_COOKIES');
  }

  public get isAnswered(): boolean {
    return this.answered;
  }

  public get hasAccepted(): boolean {
    return this.isAnswered ? this.cookieService.get('HAS_ACCEPTED_COOKIES') === 'true' : false;
  }

  public answer(isAccepted: boolean): void {
    localStorage.setItem('HAS_ACCEPTED_COOKIES', isAccepted ? 'true' : 'false');
    this.cookieService.set('HAS_ACCEPTED_COOKIES', isAccepted ? 'true' : 'false');
    this.answered = true;
  }
}
