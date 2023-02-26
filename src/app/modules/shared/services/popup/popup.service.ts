import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Popup } from '../../models/popup.model';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  newPopup: Subject<Popup> = new Subject<Popup>();

  createPopup(type: string, message: string) {
    this.newPopup.next(new Popup(type, message));
  }
}
