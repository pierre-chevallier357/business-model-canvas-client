import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Question } from '../../models/question.model';
import { LanguageService } from '../../services/language/language.service';

@Component({
  selector: 'sfc-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit, OnDestroy {
  questions: Question[] = [];
  index = 0;
  private subscription: Subscription = new Subscription();

  constructor(
    private translate: TranslateService,
    private http: HttpClient,
    private languageService: LanguageService
  ) {}

  public ngOnInit(): void {
    this.setLanguage(this.translate.getBrowserLang() ?? '');
    const language$ = this.languageService.language$.subscribe((lang) => this.setLanguage(lang));
    this.subscription.add(language$);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setLanguage(lang: string): void {
    this.http.get('assets/i18n/faq/faq-' + lang + '.json').subscribe((res) => {
      this.questions = res as Question[];
    });
  }
}
