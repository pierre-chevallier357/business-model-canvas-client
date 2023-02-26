import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';

@Component({
  selector: 'sfc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(public translate: TranslateService) {}

  public downloadPdf(): void {
    window.open('assets/download/canvas-' + this.translate.currentLang + '.pdf', '_blank');
  }
}
