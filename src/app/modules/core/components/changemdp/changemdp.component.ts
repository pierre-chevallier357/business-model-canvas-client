import { Component, EventEmitter, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PopupService } from 'src/app/modules/shared/services/popup/popup.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-changemdp',
  templateUrl: './changemdp.component.html',
  styleUrls: ['./changemdp.component.scss'],
})
export class ChangemdpComponent {
  @Output() newEventEmitter = new EventEmitter<string>();

  form: FormGroup;
  invalid: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public translate: TranslateService,
    private popupService: PopupService
  ) {
    this.form = this.fb.group(
      {
        mail: ['', Validators.required],
        code: ['', Validators.required],
        password: [
          '',
          [
            Validators.pattern(
              '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\\\[\\\](){}?\\\\|,.<>;:!~*_@#$%^&+=\-]).{8,}'
            ),
            this.matchValidator('confirmPassword', true),
          ],
        ],
        confirmpassword: ['', [this.matchValidator('password')]],
      },
      { validators: this.checkPasswords }
    );
  }

  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirmpassword')?.value;
    return pass == confirmPass ? null : { notSame: true };
  };

  matchValidator(matchTo: string, reverse?: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.parent && reverse) {
        const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
        if (c) {
          c.updateValueAndValidity();
        }
        return null;
      }
      return !!control.parent &&
        !!control.parent.value &&
        control.value === (control.parent?.controls as any)[matchTo].value
        ? null
        : { matching: true };
    };
  }

  onSubmit() {
    const val = this.form.value;

    this.authService.resetPassword(val.mail, val.code, val.password).subscribe({
      next: (response) => {
        this.invalid = false;
        this.eventEmitter('ok');
        this.translate
          .get('popup.mdpoublie.reset-success')
          .subscribe((msg) => this.popupService.createPopup('is-success', msg));
      },
      error: (error) => {
        this.invalid = true;
        console.error(error);
      },
    });
  }

  onCancel() {
    this.eventEmitter('cancel');
  }

  eventEmitter(s: string) {
    this.form.reset();
    this.newEventEmitter.emit(s);
  }
}
