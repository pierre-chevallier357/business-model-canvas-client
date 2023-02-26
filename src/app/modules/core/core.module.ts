import { CookiesConsentComponent } from './components/cookies-consent/cookies-consent.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ConnexionComponent } from './components//connexion/connexion.component';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { CheckboxModule } from 'primeng/checkbox';
import { ForgottenPasswordComponent } from './components/forgotten-password/forgotten-password.component';
import { SlideMenuModule } from 'primeng/slidemenu';
import { ProfilComponent } from './components/profil/profil.component';
import { CookieService } from 'ngx-cookie-service';
import { MenuModule } from 'primeng/menu';
import { AdministrationComponent } from './components/administration/administration/administration.component';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { UsersManagementComponent } from './components/administration/users-management/users-management.component';
import { PagesManagementComponent } from './components/administration/pages-management/pages-management.component';
import { CalendarModule } from 'primeng/calendar';
import { CanvasManagementComponent } from './components/administration/canvas-management/canvas-management.component';
import { ExcelDepositComponent } from './components/administration/excel-deposit/excel-deposit.component';
import { FileUploadModule } from 'primeng/fileupload';
import { CanvasModule } from '../canvas/canvas.module';
import { ChangemdpComponent } from './components/changemdp/changemdp.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

@NgModule({
  imports: [
    CommonModule,
    MenubarModule,
    BrowserAnimationsModule,
    TranslateModule,
    SlideMenuModule,
    ButtonModule,
    PasswordModule,
    ConfirmDialogModule,
    PaginatorModule,
    DropdownModule,
    OverlayPanelModule,
    TableModule,
    MenuModule,
    CheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    DialogModule,
    CalendarModule,
    TranslateModule,
    FileUploadModule,
    CanvasModule,
    RecaptchaModule,
    RecaptchaFormsModule,
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    ConnexionComponent,
    InscriptionComponent,
    ForgottenPasswordComponent,
    AdministrationComponent,
    UsersManagementComponent,
    PagesManagementComponent,
    CanvasManagementComponent,
    ExcelDepositComponent,
    ProfilComponent,
    ChangemdpComponent,
    CookiesConsentComponent,
  ],
  exports: [HeaderComponent, FooterComponent, CookiesConsentComponent],
  providers: [CookieService, DatePipe],
})
export class CoreModule {}
