/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CookiesConsentService } from './cookies-consent.service';

describe('Service: CookiesConsent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CookiesConsentService]
    });
  });

  it('should ...', inject([CookiesConsentService], (service: CookiesConsentService) => {
    expect(service).toBeTruthy();
  }));
});
