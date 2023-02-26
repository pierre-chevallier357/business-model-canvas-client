import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SortEvent, ConfirmationService } from 'primeng/api';
import { Subscription, take } from 'rxjs';
import { LanguageService } from 'src/app/modules/presentation/services/language/language.service';
import { User } from 'src/app/modules/shared/models/user.model';
import { PopupService } from 'src/app/modules/shared/services/popup/popup.service';
import { AdministrationService } from '../../../services/administration.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'sfc-users-management',
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss'],
  providers: [ConfirmationService],
})
export class UsersManagementComponent implements OnInit, OnDestroy {
  users: User[] = [];
  options = [{ label: '', value: false }];
  private subscription: Subscription = new Subscription();

  currentPage = 0;
  nbPages = 0;
  nbUsers = 0;
  sortColumn = '';
  sortWay = '';
  filterNom = '';
  filterPrenom = '';
  filterMail = '';
  filterEntreprise = '';
  filterAdmin = '';

  constructor(
    private administrationService: AdministrationService,
    private confirmationService: ConfirmationService,
    private popupService: PopupService,
    private languageService: LanguageService,
    public translate: TranslateService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const language$ = this.languageService.language$.subscribe((lang) => {
      if (lang == 'fr') {
        this.options = [
          { label: 'Oui', value: true },
          { label: 'Non', value: false },
        ];
      } else {
        this.options = [
          { label: 'Yes', value: true },
          { label: 'No', value: false },
        ];
      }
    });
    this.subscription.add(language$);
    this.administrationService
      .getAllUsers(
        this.currentPage + 1,
        this.sortColumn,
        this.sortWay,
        this.filterNom,
        this.filterPrenom,
        this.filterMail,
        this.filterEntreprise,
        this.filterAdmin
      )
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          if (data) {
            this.nbUsers = data[0];
            this.nbPages = data[1];
            this.users = data[2];
          } else {
            this.currentPage = 0;
            this.nbUsers = 0;
            this.nbPages = 0;
            this.users = [];
          }
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  customSort(event: SortEvent) {
    let sort = '';
    if (event?.field && event?.order) {
      if (event.order === -1) {
        sort = 'desc';
      }
      if (event.order === 1) {
        sort = 'asc';
      }
      if (this.sortColumn !== event.field || this.sortWay !== sort) {
        this.sortWay = sort;
        this.sortColumn = event.field;
        this.administrationService
          .getAllUsers(
            this.currentPage + 1,
            this.sortColumn,
            this.sortWay,
            this.filterNom,
            this.filterPrenom,
            this.filterMail,
            this.filterEntreprise,
            this.filterAdmin
          )
          .pipe(take(1))
          .subscribe({
            next: (data) => {
              if (data) {
                this.nbUsers = data[0];
                this.nbPages = data[1];
                this.users = data[2];
              } else {
                this.currentPage = 0;
                this.nbUsers = 0;
                this.nbPages = 0;
                this.users = [];
              }
            },
            error: (error) => {
              console.error(error);
            },
          });
      }
    }
  }

  onPageChange(event: any) {
    this.administrationService
      .getAllUsers(
        event.page + 1,
        this.sortColumn,
        this.sortWay,
        this.filterNom,
        this.filterPrenom,
        this.filterMail,
        this.filterEntreprise,
        this.filterAdmin
      )
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          if (data) {
            this.currentPage = event.page;
            this.nbUsers = data[0];
            this.nbPages = data[1];
            this.users = data[2];
          } else {
            this.currentPage = 0;
            this.nbUsers = 0;
            this.nbPages = 0;
            this.users = [];
          }
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  filter(event: any, column: string) {
    switch (column) {
      case 'nom':
        this.filterNom = event.target.value;
        break;
      case 'prenom':
        this.filterPrenom = event.target.value;
        break;
      case 'mail':
        this.filterMail = event.target.value;
        break;
      case 'entreprise':
        this.filterEntreprise = event.target.value;
        break;
      case 'estAdmin':
        this.filterAdmin = event;
        break;
      default:
        break;
    }
    this.administrationService
      .getAllUsers(
        1,
        this.sortColumn,
        this.sortWay,
        this.filterNom,
        this.filterPrenom,
        this.filterMail,
        this.filterEntreprise,
        this.filterAdmin
      )
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          if (data) {
            this.nbUsers = data[0];
            this.nbPages = data[1];
            this.users = data[2];
          } else {
            this.currentPage = 0;
            this.nbUsers = 0;
            this.nbPages = 0;
            this.users = [];
          }
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  deleteUser(user: User) {
    this.translate
      .get('user-management.delete')
      .pipe(take(1))
      .subscribe((deleteJson) => {
        this.confirmationService.confirm({
          message: deleteJson.message + '\n' + user.nom + ' ' + user.prenom,
          header: deleteJson.header,
          acceptLabel: deleteJson.yes,
          rejectLabel: deleteJson.no,
          icon: 'pi pi-info-circle',
          accept: () => {
            this.administrationService
              .deleteUser(user)
              .pipe(take(1))
              .subscribe({
                next: () => {
                  const index = this.users.indexOf(user);
                  if (index !== -1) {
                    this.users.splice(index, 1);
                  }
                  if (user.token === localStorage.getItem('token')) {
                    localStorage.removeItem('token');
                    this.authService.setCurrentUser('');
                    this.router.navigate(['']);
                  }
                },
                error: (error) => {
                  console.error(error);
                },
              });
          },
        });
      });
  }

  putAdmin(event: any, idUtilisateur: number) {
    this.administrationService.putAdmin(idUtilisateur, event).subscribe({
      next: () => {},
      error: (error) => {
        switch (error.status) {
          case 400:
            this.popupService.createPopup('is-danger', 'Mauvais paramètre');
            break;
          case 404:
            this.popupService.createPopup('is-danger', 'Utilisateur inexistant');
            break;
          case 406:
            this.popupService.createPopup('is-danger', 'Impossible, dernier administrateur');
            break;
          default:
            this.popupService.createPopup('is-danger', 'Erreur serveur');
            break;
        }
      },
    });
  }
}
