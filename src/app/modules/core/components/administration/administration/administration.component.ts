import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Subscription, take } from 'rxjs';
import { LanguageService } from 'src/app/modules/presentation/services/language/language.service';
import { AdministrationService } from '../../../services/administration.service';

export enum Management {
  users,
  canvas,
  faq,
}

@Component({
  selector: 'sfc-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss'],
})
export class AdministrationComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  compteurInit: MenuItem[] = [];
  compteurCree: MenuItem[] = [];
  allManagement = Management;
  management: Management = Management.users;
  private subscription: Subscription = new Subscription();

  constructor(
    private administrationService: AdministrationService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    const language$ = this.languageService.language$.subscribe(() => {
      this.translate
        .get('side-menu')
        .pipe(take(1))
        .subscribe((sideMenutext) => {
          this.items = [
            {
              label: sideMenutext.userManagement,
              icon: 'pi pi-fw pi-users',
              command: () => {
                this.switchTo(Management.users);
              },
              styleClass: 'active',
            },
            {
              label: sideMenutext.canvasManagement,
              icon: 'pi pi-fw pi-id-card',
              command: () => {
                this.switchTo(Management.canvas);
              },
            },
            {
              label: sideMenutext.pageManagement,
              icon: 'pi pi-fw pi-question-circle',
              command: () => {
                this.switchTo(Management.faq);
              },
            },
          ];
          this.translate.get('side-menu').subscribe((sideMenutext) =>
            this.administrationService
              .getCanvasInitCount()
              .pipe(take(1))
              .subscribe((count) => {
                this.compteurInit = [
                  {
                    label: sideMenutext.startedCanvas + String(count),
                    icon: 'pi pi-fw pi-stopwatch',
                    styleClass: 'active',
                  },
                ];
              })
          );
          this.translate.get('side-menu').subscribe((sideMenutext) =>
            this.administrationService
              .getCanvasSavedCount()
              .pipe(take(1))
              .subscribe((count) => {
                this.compteurCree = [
                  {
                    label: sideMenutext.createdCanvas + String(count),
                    icon: 'pi pi-fw pi-stopwatch',
                    styleClass: 'active',
                  },
                ];
              })
          );
        });
    });
    this.subscription.add(language$);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private switchTo(management: Management) {
    this.management = management;
  }
}
