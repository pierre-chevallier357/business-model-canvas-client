import { Observable, Subscription, take } from 'rxjs';
import { ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { LanguageService } from 'src/app/modules/presentation/services/language/language.service';
import { AuthService } from '../../services/auth/auth.service';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'sfc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [ConfirmationService],
})
export class HeaderComponent implements OnInit {
  displayInscription = false;
  displayForgottenPassword = false;
  reset = false;
  profileItems: MenuItem[] = [];
  isAdmin = false;

  private subscription: Subscription = new Subscription();

  constructor(
    public translate: TranslateService,
    private languageService: LanguageService,
    private viewportScroller: ViewportScroller,
    public router: Router,
    private confirmationService: ConfirmationService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const language$ = this.languageService.language$.subscribe((lang) => {
      if (lang == 'fr') {
        this.profileItems = [
          {
            label: 'Mes canvas',
            icon: 'pi pi-calendar',
            routerLink: 'my-canvas-list',
          },
          {
            label: 'Paramètres',
            icon: 'pi pi-cog',
            routerLink: '/profil',
          },
          {
            label: 'Se déconnecter',
            icon: 'pi pi-power-off',
            command: () => this.onLogout(),
          },
        ];
      } else {
        this.profileItems = [
          {
            label: 'My canvas',
            icon: 'pi pi-calendar',
            routerLink: 'my-canvas-list',
          },
          {
            label: 'Settings',
            icon: 'pi pi-cog',
            routerLink: '/profil',
          },
          {
            label: 'Log out',
            icon: 'pi pi-power-off',
            command: () => this.onLogout(),
          },
        ];
      }
      const isAdmin$ = this.getIsAdmin().subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
        if (isAdmin && this.profileItems.length < 4) {
          this.profileItems.splice(1, 0, {
            label: 'Administration',
            icon: 'pi pi-user',
            routerLink: '/admin',
          });
        }
      });
      this.subscription.add(isAdmin$);
    });
    this.subscription.add(language$);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public get oppositeLanguage(): string {
    return this.translate.currentLang === 'en' ? 'fr' : 'en';
  }

  public switchLang(lang: string): void {
    this.translate.use(lang);
    this.languageService.language$.next(lang);
  }
  public displayConnexion() {
    return this.authService.connexionDialogIsOpen;
  }

  showConnexionDialog() {
    this.displayInscription = false;
    this.displayForgottenPassword = false;
    this.authService.openConnexionDialog();
  }

  eventEmitter(event: any) {
    if (event === 'inscription') {
      this.authService.closeConnexionDialog();
      this.displayInscription = true;
    } else if (event === 'mdpoublie') {
      this.authService.closeConnexionDialog();
      this.displayForgottenPassword = true;
    } else if (event === 'ok') {
      this.authService.closeConnexionDialog();
      this.displayInscription = false;
      this.displayForgottenPassword = false;
    } else if (event === 'cancel') {
      this.authService.closeConnexionDialog();
      this.displayInscription = false;
      this.displayForgottenPassword = false;
    }
  }
  close() {
    this.reset = true;
    this.reset = false;
  }

  onLogout() {
    this.authService.logout();
    this.authService.isAdmin$.pipe(take(1)).subscribe((admin) => {
      this.isAdmin = admin;
    });
    this.languageService.language$.next(this.translate.currentLang);
  }

  public openConfirmationDialog(lang: string): void {
    const currentLanguage = this.translate.currentLang === 'en' ? 'en' : 'fr';
    let dialogMessage = '';
    if (currentLanguage === 'fr') {
      dialogMessage =
        'Changer de langue vous fera perdre les données remplies dans le canvas courant. Êtes-vous sûr de vouloir changer de langue ?';
    } else {
      dialogMessage =
        'Switching language will make you lose the filled data from the current canvas. Are you sure you want to switch language?';
    }
    this.confirmationService.confirm({
      message: dialogMessage,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.switchLang(lang);
      },
    });
  }

  public async goToSection(section: string): Promise<void> {
    if (this.router.url === '/') {
      this.viewportScroller.scrollToAnchor(section);
    } else {
      await this.router.navigateByUrl('/');
      setTimeout(() => {
        this.viewportScroller.scrollToAnchor(section);
      }, 100);
    }
  }

  public getIsAdmin(): Observable<boolean> {
    return this.authService.isAdmin$;
  }
}
