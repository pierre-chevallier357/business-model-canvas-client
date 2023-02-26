import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { CookiesConsentService } from '../../services/cookies-consent/cookies-consent.service';
import { Router } from '@angular/router';

@Component({
  selector: 'sfc-cookies-consent',
  templateUrl: './cookies-consent.component.html',
  styleUrls: ['./cookies-consent.component.scss'],
})
export class CookiesConsentComponent implements OnInit {
  public isDialogOpened = false;

  constructor(
    private cookiesConsentService: CookiesConsentService,
    public translate: TranslateService,
    public router: Router
  ) {}

  public ngOnInit(): void {
    const hasAnsweredCookies = !!localStorage.getItem('HAS_ACCEPTED_COOKIES');
    this.isDialogOpened = !hasAnsweredCookies;
  }

  public answerCookiesConsent(isAccepted: boolean): void {
    this.isDialogOpened = false;
    this.cookiesConsentService.answer(isAccepted);
  }
}
