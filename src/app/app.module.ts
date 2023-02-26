import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from './modules/shared/shared.module';
import { CanvasModule } from './modules/canvas/canvas.module';
import { PresentationModule } from './modules/presentation/presentation.module';
import { CoreModule } from './modules/core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { HttpClientModule, HttpBackend } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { AdminGuard } from './modules/core/guards/admin.guard';
import { SidebarModule } from 'primeng/sidebar';
import { ListboxModule } from 'primeng/listbox';
import { DialogModule } from 'primeng/dialog';
import { RECAPTCHA_LANGUAGE } from 'ng-recaptcha';
import { LanguageService } from './modules/core/services/language.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CoreModule,
    RouterModule,
    PresentationModule,
    CanvasModule,
    SharedModule,
    AccordionModule,
    TooltipModule,
    FileUploadModule,
    ToastModule,
    SidebarModule,
    ListboxModule,
    DialogModule,

    // ngx-translate and the loader module
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpBackend],
      },
    }),
    BrowserAnimationsModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    LanguageService,
    {
      provide: RECAPTCHA_LANGUAGE,
      useFactory: (languageService: LanguageService) => languageService.currentLang,
      deps: [LanguageService],
    },
    AdminGuard,
  ],
})
export class AppModule {}

// AoT requires an exported function for factories
export function HttpLoaderFactory(_httpBackend: HttpBackend) {
  return new MultiTranslateHttpLoader(_httpBackend, [
    { prefix: './assets/i18n/home/home-', suffix: '.json' },
    { prefix: './assets/i18n/header/header-', suffix: '.json' },
    { prefix: './assets/i18n/footer/footer-', suffix: '.json' },
    { prefix: './assets/i18n/faq/faqPage-', suffix: '.json' },
    { prefix: './assets/i18n/conditions/conditions-', suffix: '.json' },
    { prefix: './assets/i18n/policy/policy-', suffix: '.json' },
    { prefix: './assets/i18n/mentions/mentions-', suffix: '.json' },
    { prefix: './assets/i18n/excel-deposit/excel-deposit-', suffix: '.json' },
    { prefix: './assets/i18n/canvas/canvas-button-', suffix: '.json' },
    { prefix: './assets/i18n/popup-message/popup-message-', suffix: '.json' },
    { prefix: './assets/i18n/my-canvas-list/my-canvas-list-', suffix: '.json' },
    { prefix: './assets/i18n/cookies/cookies-', suffix: '.json' },
    { prefix: './assets/i18n/profil/profil-', suffix: '.json' },
    { prefix: './assets/i18n/inscription/inscription-', suffix: '.json' },
    { prefix: './assets/i18n/connexion/connexion-', suffix: '.json' },
    { prefix: './assets/i18n/mdpoublie/mdpoublie-', suffix: '.json' },
    { prefix: './assets/i18n/administration/administration-', suffix: '.json' },
    { prefix: './assets/i18n/canvas/canvas-footer-', suffix: '.json' },
  ]);
}
