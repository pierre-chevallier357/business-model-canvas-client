import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sfc-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  constructor(public router: Router) {}

  public openNewWebPage(link: string): void {
    window.open(link, '_blank');
  }
}
