import { Component, EventEmitter, Output, ViewChild, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConnectedUser } from 'src/app/modules/shared/models/user.model';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'sfc-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss'],
})
export class InscriptionComponent {
  @Output() newEventEmitter = new EventEmitter<string>();
  @ViewChild('myform') myform!: HTMLFormElement;
  form: FormGroup;
  invalid = false;
  alreadymail = false;
  captchaValid = false;
  user!: ConnectedUser;
  currentLanguage;

  constructor(
    public translate: TranslateService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        lastname: ['', Validators.required],
        firstname: ['', Validators.required],
        mail: [
          '',
          [
            Validators.required,
            Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9._%+-]{2,}[.][A-Za-z]{2,}$'),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\\[\\](){}?\\\\|,.<>;:"\'!§°/£~*_@#$%^&+=-]).{8,}'
            ),
            this.matchValidator('confirmPassword', true),
          ],
        ],
        confirmpassword: ['', [Validators.required, this.matchValidator('password')]],
        entreprise: ['', Validators.required],
        conditions: [false, Validators.requiredTrue],
        recaptchaReactive: ['', Validators.required],
      },
      { validators: this.checkPasswords }
    );
  }

  onCancel(): void {
    this.eventEmitter('cancel');
  }

  onSubmit() {
    const val = this.form.value;
    if (this.form.valid) {
      if (val.password === val.confirmpassword && val.conditions == true) {
        this.authService
          .register(val.firstname, val.lastname, val.mail, val.password, val.entreprise)
          .subscribe({
            next: (response) => {
              this.user = response;
              this.eventEmitter('ok');
            },
            error: (error) => {
              if (error.status == 409) this.alreadymail = true;
              else this.invalid = true;
              console.log(error);
            },
          });
      } else {
        this.invalid = true;
      }
    } else {
      this.invalid = true;
    }
  }

  eventEmitter(s: string) {
    this.form.reset();
    this.invalid = false;
    this.captchaValid = false;
    this.newEventEmitter.emit(s);
  }

  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmpassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
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

  resolved(captchaResponse: string) {
    this.authService.verifyCaptcha(captchaResponse).subscribe({
      next: (response) => {
        if (response.success) {
          this.captchaValid = true;
        } else {
          this.captchaValid = false;
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
