import { CanvasService } from './../../services/canvas/canvas.service';
import { TranslateService } from '@ngx-translate/core';
import {
  Component,
  Inject,
  Input,
  LOCALE_ID,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../../presentation/services/language/language.service';
import { Canvas, CanvasEquipe, CanvasIndividuel, Statut } from '../../models/canvas';
import { DatePipe, registerLocaleData } from '@angular/common';
import * as fr from '@angular/common/locales/fr';
import { Box } from '../../models/box';
import { HeaderLibelle } from '../../models/header-libelle';
import { Output, EventEmitter } from '@angular/core';
import { User } from '../../models/user';

@Component({
  selector: 'sfc-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
})
export class CanvasComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public isExportingAsPdf!: boolean;
  @Input() public readOnly!: boolean;
  @Input() public canvasReadOnly!: CanvasIndividuel | CanvasEquipe | Canvas;
  @Output() canvasNameChange = new EventEmitter<string>();
  @Output() isUpdated = new EventEmitter<boolean>();
  @Input() title: string = '';
  public boxList: Box[] = [];
  public whyAndHow: string[] = [];
  private subscription: Subscription = new Subscription();
  public focusedBoxNumber: number | null = null;
  public date: Date = new Date();
  public headerLibelle: HeaderLibelle = new HeaderLibelle();
  titlePDF = '';

  constructor(
    public readonly translate: TranslateService,
    private readonly languageService: LanguageService,
    private readonly canvasService: CanvasService,
    @Inject(DatePipe) private datePipe: DatePipe
  ) {
    registerLocaleData(fr.default);
    this.canvasReadOnly = this.canvasService.injectCanvas$.value;
    if (this.canvasReadOnly) this.date = this.canvasReadOnly.dateModification!;
  }

  public ngOnInit(): void {
    // Lors de la V2 :
    // TODO: Requête get canvas au CanvasService
    // TODO: map canvas to boxList
    const canvasVersion$ = this.canvasService
      .setCanvasCurrentVersion()
      .subscribe((canvasCurrentLabel) => {
        this.canvasService.canvasCurrentVersion$.next(canvasCurrentLabel);
        this.fillCanvasLabels();
      });
    this.subscription.add(canvasVersion$);
    const focusedBox$ = this.canvasService.focusedBox$.subscribe((boxNumber) => {
      this.focusedBoxNumber = boxNumber;
    });
    this.subscription.add(focusedBox$);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isExportingAsPdf']) {
      if (changes['isExportingAsPdf'].currentValue) {
        this.titlePDF = this.title;
      } else {
        this.titlePDF = '';
      }
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.canvasService.injectCanvas$.next({
      nom: '',
      statutModification: Statut.enCours,
      utilisateurDto: { token: '' } as unknown as User,
      version: '1.0',
      allElements: [],
    });
  }
  updated() {
    this.isUpdated.emit(true);
    this.date = new Date();
  }

  private fillCanvasLabels(): void {
    const language$ = this.languageService.language$.subscribe((language) => {
      this.whyAndHow = language === 'fr' ? ['Pourquoi', 'Comment'] : ['Why', 'How'];
      const canvasHistory$ = this.canvasService.isCanvasHistory$.subscribe(() => {
        this.canvasService
          .getCanvasHeaderLabel(language)
          .subscribe((label) => (this.headerLibelle = label));
        this.setBoxList(language);
      });
      this.subscription.add(canvasHistory$);
    });
    this.subscription.add(language$);
  }

  public nameChange() {
    this.canvasNameChange.emit(this.title);
    this.isUpdated.emit(true);
    this.date = new Date();
  }

  private setBoxList(language: string): void {
    this.canvasService.getBoxLabelList(language).subscribe((boxList) => {
      this.boxList = boxList.map((box) => {
        box.number = +box.number;
        return box;
      });
      this.setTooltips(language);
    });
  }

  private setTooltips(language: string): void {
    this.canvasService.getCanvasToolTipLabel(language, 'indiv').subscribe((canvasToolTip) => {
      Object.entries(canvasToolTip).forEach(([key, value], index) => {
        this.boxList[index].tooltip = value;
      });
    });
  }
}
