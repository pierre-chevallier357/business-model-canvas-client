import { Component, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Popup } from '../../models/popup.model';
import { PopupService } from '../../services/popup/popup.service';

@Component({
  selector: 'sfc-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService],
})
export class PopUpComponent {
  popups: Popup[] = [];

  constructor(private popupService: PopupService, private messageService: MessageService) {}

  ngOnInit() {
    this.popupService.newPopup.subscribe((popup) => {
      switch (popup.type) {
        case 'is-success':
          this.showSuccess(popup.text);
          break;
        case 'is-warning':
          this.showWarning(popup.text);
          break;
        case 'is-danger':
          this.showDanger(popup.text);
          break;
      }
    });
  }

  showSuccess(text: string) {
    this.messageService.add({ key: 'toast', severity: 'success', detail: text, life: 7000 });
  }

  showWarning(text: string) {
    this.messageService.add({ key: 'toast', severity: 'warn', detail: text, life: 7000 });
  }

  showDanger(text: string) {
    this.messageService.add({ key: 'toast', severity: 'error', detail: text, life: 7000 });
  }
}
