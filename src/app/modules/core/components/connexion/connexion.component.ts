import { Component, EventEmitter, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConnectedUser } from 'src/app/modules/shared/models/user.model';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'sfc-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss'],
})
export class ConnexionComponent implements OnChanges {
  @Output() newEventEmitter = new EventEmitter<string>();
  invalid = false;

  user!: ConnectedUser;

  form: FormGroup;

  constructor(private fb: FormBuilder, public authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      mail: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnChanges(changes: any): void {
    const resetChange: boolean = changes.reset.currentValue;
    this.invalid = false;
    if (resetChange) {
      this.form.reset();
      this.invalid = false;
    }
  }

  onCancel() {
    this.eventEmitter('cancel');
  }

  onSubmit() {
    const val = this.form.value;

    this.authService.login(val.mail, val.password).subscribe({
      next: (response) => {
        this.user = response;
        this.invalid = false;
        this.eventEmitter('ok');
      },
      error: (error) => {
        this.invalid = true;
        console.log(error);
      },
    });

    this.form.reset();
  }

  eventEmitter(s: string) {
    this.form.reset();
    this.invalid = false;
    this.newEventEmitter.emit(s);
  }
}
