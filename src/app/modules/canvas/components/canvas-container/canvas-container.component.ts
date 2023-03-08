import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/core/services/auth/auth.service';
import { take } from 'rxjs';
import { CanvasService } from '../../services/canvas/canvas.service';
import { User } from '../../models/user';
import { TranslateService } from '@ngx-translate/core';
import { PopupService } from 'src/app/modules/shared/services/popup/popup.service';
import { CanvasIndividuel, Statut } from '../../models/canvas';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'sfc-canvas-container',
  templateUrl: './canvas-container.component.html',
  styleUrls: ['./canvas-container.component.scss'],
})
export class CanvasContainerComponent implements OnInit, OnDestroy {
  private readonly LANDSCAPE_WIDTH = 780;
  public isExportingAsPdf = false;
  public showSideBar = false;
  public userIsConnected = false;
  public canvasLastModificationDate: Date = new Date();
  private subscription: Subscription = new Subscription();
  private canvasToSend: CanvasIndividuel = {
    nom: '',
    statutModification: Statut.enCours,
    utilisateurDto: { token: '' } as unknown as User,
    version: '1.0',
    allElements: [],
  };
  public showDialog = false;
  public isSaveCanvas = false;
  public canvasName = '';

  constructor(
    private authService: AuthService,
    private canvasService: CanvasService,
    private translate: TranslateService,
    private popupService: PopupService,
    @Inject(DatePipe) private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const canvas = this.canvasService.injectCanvas$.value;
    const auth$ = this.authService.userIsConnected$.subscribe(
      (userIsConnected) => (this.userIsConnected = userIsConnected)
    );
    this.subscription.add(auth$);
    if (canvas.guidcanvas) {
      this.canvasToSend.guidcanvas = canvas.guidcanvas;
      this.canvasName = canvas.nom;
      this.canvasLastModificationDate = canvas.dateModification!;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  updated() {
    this.canvasLastModificationDate = new Date();
  }

  public exportAsPdf(): void {
    if (this.checkTitle()) {
      this.isExportingAsPdf = true;
      setTimeout(() => {
        const content: HTMLElement = document.getElementById('canvas') as HTMLElement;
        const options = {
          filename: `StartupFounderCanvas-${this.canvasName}-${this.datePipe.transform(
            this.canvasLastModificationDate,
            'yyyyMMdd'
          )}.pdf`,
          image: { type: 'png' },
          html2canvas: {},
          jsPDF: { orientation: 'landscape' },
        };
        html2pdf().from(content).set(options).save();
        setTimeout(() => {
          this.canvasService.incrementCanvasCount().subscribe();
          this.isExportingAsPdf = false;
        }, 2000);
      }, 100);
    }
  }

  public saveCanvas(): void {
    if (this.checkTitle() && this.checkConnected()) {
      if (this.canvasToSend.guidcanvas === undefined) {
        this.createCanvas();
        this.canvasName = '';
      } else {
        this.updateCanvas();
        this.canvasToSend = {
          nom: '',
          statutModification: Statut.enCours,
          utilisateurDto: { token: '' } as unknown as User,
          version: '1.0',
          allElements: [],
        };
        this.canvasName = '';
      }
      this.canvasService.resetElementList();
    }
  }

  changeName(name: string) {
    this.canvasName = name;
  }

  public checkConnected() {
    if (!this.authService.connected) {
      this.translate
        .get('popup.canvas.connexion-missing-for-save')
        .subscribe((msg) => this.popupService.createPopup('is-warning', msg));
      this.authService.openConnexionDialog();
      return false;
    }
    return true;
  }

  public checkTitle() {
    if (this.canvasName === undefined || this.canvasName === null || this.canvasName === '') {
      this.translate
        .get('popup.canvas.title-missing')
        .subscribe((msg) => this.popupService.createPopup('is-warning', msg));
      return false;
    }
    return true;
  }

  public createCanvas(): void {
    this.canvasService.elementList$.pipe(take(1)).subscribe((elemList) => {
      this.canvasToSend.allElements = elemList;
      this.canvasToSend.utilisateurDto = {
        token: localStorage.getItem('token')!,
      } as unknown as User;
      this.canvasToSend.nom = this.canvasName;
      this.canvasService.createCanvas(this.canvasToSend).subscribe({
        next: (data) => {
          if (data) {
            this.translate
              .get('popup.canvas.create-success')
              .subscribe((msg) => this.popupService.createPopup('is-success', msg));
          }
        },
        error: () => {
          this.translate
            .get('popup.canvas.create-fail')
            .subscribe((msg) => this.popupService.createPopup('is-danger', msg));
        },
      });
    });
  }

  public updateCanvas(): void {
    const canvas = this.canvasService.injectCanvas$.value;
    this.canvasService.elementList$.pipe(take(1)).subscribe((elemList) => {
      this.canvasToSend.guidcanvas = canvas.guidcanvas;
      this.canvasToSend.version = canvas.version;
      this.canvasToSend.utilisateurDto = {
        token: localStorage.getItem('token')!,
      } as unknown as User;
      this.canvasToSend.allElements = elemList;
      this.canvasToSend.nom = this.canvasName;
      this.canvasService.updateCanvas(this.canvasToSend).subscribe({
        next: (data) => {
          if (data) {
            this.translate
              .get('popup.canvas.update-success')
              .subscribe((msg) => this.popupService.createPopup('is-success', msg));
          }
          this.canvasService.injectCanvas$.next({
            nom: '',
            statutModification: Statut.enCours,
            utilisateurDto: { token: '' } as unknown as User,
            version: '1.0',
            allElements: [],
          });
        },
        error: () => {
          this.translate
            .get('popup.canvas.update-fail')
            .subscribe((msg) => this.popupService.createPopup('is-danger', msg));
        },
      });
    });
  }
}
