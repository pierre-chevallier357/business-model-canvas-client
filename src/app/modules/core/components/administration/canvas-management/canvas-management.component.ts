import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, SortEvent } from 'primeng/api';
import { take } from 'rxjs';
import { Canvas, CanvaType, Statut } from 'src/app/modules/canvas/models/canvas';
import { CanvasService } from 'src/app/modules/canvas/services/canvas/canvas.service';
import { AdministrationService } from '../../../services/administration.service';

@Component({
  selector: 'sfc-canvas-management',
  templateUrl: './canvas-management.component.html',
  styleUrls: ['./canvas-management.component.scss'],
  providers: [ConfirmationService],
})
export class CanvasManagementComponent implements OnInit {
  canvas: Canvas[] = [];
  currentPageCanvas = 0;
  nbPagesCanvas = 0;
  nbCanvas = 0;
  sortColumnCanvas = '';
  sortWayCanvas = '';
  rangeDatesCanvas: Date[] = [];
  filterNomCanvas = '';
  filterStatutCanvas = '';
  filterVersionCanvas = '';
  filterDateStartCanvas: Date | undefined = undefined;
  filterDateEndCanvas: Date | undefined = undefined;
  filterUserFirstnameCanvas = '';
  filterUserLastnameCanvas = '';
  filterEntrepriseCanvas = '';
  filterTypeCanvas = '';
  canvasSelected!: Canvas;
  displayModal = false;

  optionsType = [
    { label: 'Individuel', value: CanvaType.Individuel },
    { label: 'Collectif', value: CanvaType.Collectif },
  ];

  optionsStatut = [
    { label: 'Créé', value: Statut.cree },
    { label: 'En cours', value: Statut.enCours },
    { label: 'Terminé', value: Statut.termine },
  ];

  constructor(
    private administrationService: AdministrationService,
    private confirmationService: ConfirmationService,
    private canvasService: CanvasService,
    public translate: TranslateService
  ) {}
  ngOnInit(): void {
    this.administrationService
      .getAllCanvas(
        this.currentPageCanvas + 1,
        this.sortColumnCanvas,
        this.sortWayCanvas,
        this.filterNomCanvas,
        this.filterStatutCanvas,
        this.filterVersionCanvas,
        this.filterDateStartCanvas,
        this.filterDateEndCanvas,
        this.filterUserFirstnameCanvas,
        this.filterUserLastnameCanvas,
        this.filterEntrepriseCanvas,
        this.filterTypeCanvas
      )
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          if (data) {
            this.nbCanvas = data[0];
            this.nbPagesCanvas = data[1];
            this.canvas = data[2];
          } else {
            this.currentPageCanvas = 0;
            this.nbCanvas = 0;
            this.nbPagesCanvas = 0;
            this.canvas = [];
          }
        },
        error: (error) => {
          console.error(error);
        },
      });
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
      if (this.sortColumnCanvas !== event.field || this.sortWayCanvas !== sort) {
        this.sortWayCanvas = sort;
        this.sortColumnCanvas = event.field;
        this.administrationService
          .getAllCanvas(
            this.currentPageCanvas + 1,
            this.sortColumnCanvas,
            this.sortWayCanvas,
            this.filterNomCanvas,
            this.filterStatutCanvas,
            this.filterVersionCanvas,
            this.filterDateStartCanvas,
            this.filterDateEndCanvas,
            this.filterUserFirstnameCanvas,
            this.filterUserLastnameCanvas,
            this.filterEntrepriseCanvas,
            this.filterTypeCanvas
          )
          .pipe(take(1))
          .subscribe({
            next: (data) => {
              if (data) {
                this.nbCanvas = data[0];
                this.nbPagesCanvas = data[1];
                this.canvas = data[2];
              } else {
                this.currentPageCanvas = 0;
                this.nbCanvas = 0;
                this.nbPagesCanvas = 0;
                this.canvas = [];
              }
            },
            error: (error) => {
              console.error(error);
            },
          });
      }
    }
  }

  onPageChangeCanvas(event: any) {
    this.administrationService
      .getAllCanvas(
        event.page + 1,
        this.sortColumnCanvas,
        this.sortWayCanvas,
        this.filterNomCanvas,
        this.filterStatutCanvas,
        this.filterVersionCanvas,
        this.filterDateStartCanvas,
        this.filterDateEndCanvas,
        this.filterUserFirstnameCanvas,
        this.filterUserLastnameCanvas,
        this.filterEntrepriseCanvas,
        this.filterTypeCanvas
      )
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          if (data) {
            this.currentPageCanvas = event.page;
            this.nbCanvas = data[0];
            this.nbPagesCanvas = data[1];
            this.canvas = data[2];
          } else {
            this.currentPageCanvas = 0;
            this.nbCanvas = 0;
            this.nbPagesCanvas = 0;
            this.canvas = [];
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
        this.filterNomCanvas = event.target.value;
        break;
      case 'version':
        this.filterVersionCanvas = event.target.value;
        break;
      case 'userFirstname':
        this.filterUserFirstnameCanvas = event.target.value;
        break;
      case 'userLastname':
        this.filterUserLastnameCanvas = event.target.value;
        break;
      case 'entreprise':
        this.filterEntrepriseCanvas = event.target.value;
        break;
      case 'type':
        this.filterTypeCanvas = CanvaType[event.value];
        break;
      case 'statut':
        this.filterStatutCanvas = Statut[event.value];
        break;
      case 'dateModification':
        if (this.rangeDatesCanvas[0]) {
          this.filterDateStartCanvas = this.rangeDatesCanvas[0];
        }
        if (this.rangeDatesCanvas[1]) {
          this.filterDateEndCanvas = this.rangeDatesCanvas[1];
        }
        break;
      case 'dateClear':
        this.filterDateStartCanvas = undefined;
        this.filterDateEndCanvas = undefined;
        break;
      default:
        break;
    }
    this.administrationService
      .getAllCanvas(
        1,
        this.sortColumnCanvas,
        this.sortWayCanvas,
        this.filterNomCanvas,
        this.filterStatutCanvas,
        this.filterVersionCanvas,
        this.filterDateStartCanvas,
        this.filterDateEndCanvas,
        this.filterUserFirstnameCanvas,
        this.filterUserLastnameCanvas,
        this.filterEntrepriseCanvas,
        this.filterTypeCanvas
      )
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          if (data) {
            this.currentPageCanvas = 0;
            this.nbCanvas = data[0];
            this.nbPagesCanvas = data[1];
            this.canvas = data[2];
          } else {
            this.currentPageCanvas = 0;
            this.nbCanvas = 0;
            this.nbPagesCanvas = 0;
            this.canvas = [];
          }
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  deleteCanvas(canvas: Canvas) {
    this.translate
      .get('canvas-management.delete')
      .pipe(take(1))
      .subscribe((deleteJson) => {
        this.confirmationService.confirm({
          message: deleteJson.message + '\n' + canvas.nom,
          header: deleteJson.header,
          acceptLabel: deleteJson.yes,
          rejectLabel: deleteJson.no,
          icon: 'pi pi-info-circle',
          accept: () => {
            this.administrationService
              .deleteCanvas(canvas)
              .pipe(take(1))
              .subscribe({
                next: () => {
                  const index = this.canvas.indexOf(canvas);
                  if (index !== -1) {
                    this.canvas.splice(index, 1);
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
  visualizationIndividualCanva(canva: Canvas) {
    this.canvasSelected = canva;
    this.displayModal = true;
    this.canvasService.elementReadOnlyList$.next([...this.canvasSelected.allElements]);
  }
  getCanvasName(): string {
    return this.canvasSelected?.nom;
  }
}
