import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './modules/core/services/auth/auth.service';

@Component({
  selector: 'sfc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  ngOnInit() {
    this.setCurrentUser();
  }
  constructor(public translate: TranslateService, private authService: AuthService) {
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang?.match(/fr|en/) ? browserLang : 'fr');
  }

  setCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return;
    this.authService.setCurrentUser(token);
  }
}
