import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PopupService } from 'src/app/modules/shared/services/popup/popup.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'sfc-forgotten-password',
  templateUrl: './forgotten-password.component.html',
  styleUrls: ['./forgotten-password.component.scss'],
})
export class ForgottenPasswordComponent {
  @Output() newEventEmitter = new EventEmitter<string>();
  form: FormGroup;
  already: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public translate: TranslateService,
    private popupService: PopupService
  ) {
    this.form = this.fb.group({
      mail: ['', Validators.required],
    });
  }

  onCancel(): void {
    this.eventEmitter('cancel');
  }

  alreadyCode() {
    this.already = true;
  }

  onSubmit() {
    const val = this.form.value;
    this.authService.sendResetMail(val.mail).subscribe({
      next: () => {
        this.already = true;
        this.translate
          .get('popup.mdpoublie.mail-success')
          .subscribe((msg) => this.popupService.createPopup('is-success', msg));
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.form.reset();
  }

  eventEmitter(s: string) {
    this.form.reset();
    this.newEventEmitter.emit(s);
  }
  eventEmitterReceive(event: any) {
    if (event == 'ok') this.eventEmitter('cancel');
    else {
      this.form.reset();
      this.already = false;
    }
  }
}
