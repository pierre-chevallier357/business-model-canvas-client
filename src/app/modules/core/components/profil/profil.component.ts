import { Component, OnInit } from '@angular/core';
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
import { PopupService } from 'src/app/modules/shared/services/popup/popup.service';
import { AuthService } from '../../services/auth/auth.service';
import { ProfilService } from '../../services/profil/profil.service';

@Component({
  selector: 'sfc-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
})
export class ProfilComponent implements OnInit {
  form: FormGroup;
  displayDelete = false;
  user!: ConnectedUser;
  invalid = false;

  constructor(
    public translate: TranslateService,
    private fb: FormBuilder,
    private profilService: ProfilService,
    private router: Router,
    private authService: AuthService,
    private popupService: PopupService
  ) {
    this.form = this.fb.group(
      {
        mail: ['', Validators.required],
        lastname: ['', Validators.required],
        firstname: ['', Validators.required],
        oldpassword: [''],
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
        entreprise: ['', Validators.required],
      },
      { validators: [this.checkPasswords, this.checkNullPassword] }
    );
  }

  ngOnInit(): void {
    const userToken = localStorage.getItem('token') || '';
    this.profilService.getUser(userToken).subscribe({
      next: (response) => {
        this.user = response;
        this.form.controls['mail'].setValue(this.user.mail);
        this.form.controls['lastname'].setValue(this.user.nom);
        this.form.controls['firstname'].setValue(this.user.prenom);
        this.form.controls['entreprise'].setValue(this.user.entreprise);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onSubmit() {
    const val = this.form.value;
    const userToken = localStorage.getItem('token') || '';

    this.profilService
      .saveEditProfil(
        val.mail,
        val.lastname,
        val.firstname,
        val.oldpassword,
        val.password,
        val.entreprise,
        userToken
      )
      .subscribe({
        next: (response) => {
          this.user = response;
          localStorage.setItem('token', this.user.token);
          this.invalid = false;
          this.translate
                .get('popup.profil.update-success')
                .subscribe((msg) => this.popupService.createPopup('is-success', msg));
        },
        error: (error) => {
          this.invalid = true;
          console.error(error);
        },
      });
  }

  delete() {
    this.displayDelete = true;
  }

  canceldelete() {
    this.displayDelete = false;
  }

  confirmdelete() {
    const userToken = localStorage.getItem('token') || '';
    this.profilService.deleteUser(userToken).subscribe({
      next: () => {
        localStorage.removeItem('token');
        this.authService.setCurrentUser('');
        this.router.navigate(['']);
        this.translate
                .get('popup.profil.delete-success')
                .subscribe((msg) => this.popupService.createPopup('is-success', msg));
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmpassword')?.value;
    return pass == confirmPass ? null : { notSame: true };
  };

  checkNullPassword: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    if (
      group.get('oldpassword')?.value != '' ||
      group.get('password')?.value != '' ||
      group.get('confirmpassword')?.value != ''
    ) {
      if (
        group.get('oldpassword')?.value != '' &&
        group.get('password')?.value != '' &&
        group.get('confirmpassword')?.value != ''
      )
        return null;
      else return { emptypassword: true };
    } else {
      return null;
    }
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
}
