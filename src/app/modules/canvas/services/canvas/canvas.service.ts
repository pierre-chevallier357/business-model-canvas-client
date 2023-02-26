import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Element } from '../../models/element';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CanvasIndividuel, Statut } from '../../models/canvas';
import { Box } from '../../models/box';
import { User } from '../../models/user';
import { HeaderLibelle } from '../../models/header-libelle';
import { CanvasToolTip } from '../../models/canvas-tooltip';

const API_PATH = 'https://startupfoundercanvas.alwaysdata.net/api/';
const LANG_FILE_PATH = '../../../../../assets/i18n/canvas/';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  public elementList$: BehaviorSubject<Element[]> = new BehaviorSubject<Element[]>([]);
  public isCanvasHistory$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public elementReadOnlyList$: BehaviorSubject<Element[]> = new BehaviorSubject<Element[]>([]);
  public canvasCurrentVersion$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public focusedBox$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  public injectCanvas$: BehaviorSubject<CanvasIndividuel> = new BehaviorSubject<CanvasIndividuel>({
    nom: '',
    statutModification: Statut.enCours,
    utilisateurDto: { token: '' } as unknown as User,
    version: '1.0',
    allElements: [],
  });
  public historyCanvas$: BehaviorSubject<CanvasIndividuel> = new BehaviorSubject<CanvasIndividuel>({
    nom: '',
    statutModification: Statut.enCours,
    version: '1.0',
    utilisateurDto: { token: '' } as unknown as User,
    allElements: [],
  });

  constructor(private httpClient: HttpClient) {}

  public getBoxLabelList(language: string): Observable<Box[]> {
    return this.getCanvasLabel('box-list', language).pipe(
      map((boxList: any) =>
        language === 'fr'
          ? this.mapBoxJsonToBoxTs(boxList.boxListFr)
          : this.mapBoxJsonToBoxTs(boxList.boxListEn)
      )
    );
  }
  public mapBoxJsonToBoxTs(boxListJson: { number: number; title: string }[]): Box[] {
    return boxListJson.map((boxJson) => {
      return { number: boxJson.number, title: boxJson.title, tooltip: '' } as Box;
    });
  }

  public getAllCanvasByUserToken(userToken: string): Observable<CanvasIndividuel[]> {
    return this.httpClient.get<CanvasIndividuel[]>(API_PATH + 'canvasindividuel/all/' + userToken);
  }

  public deleteIndividualCanvas(canvasId: number): Observable<any> {
    return this.httpClient.delete(
      API_PATH +
        'canvasindividuel/delete?token=' +
        localStorage.getItem('token')! +
        '&guidcanvas=' +
        canvasId
    );
  }

  public createCanvas(canvasToCreate: CanvasIndividuel): Observable<any> {
    return this.httpClient.post<CanvasIndividuel>(
      API_PATH + 'canvasindividuel/create',
      canvasToCreate
    );
  }

  public updateCanvas(canvasToUpdate: CanvasIndividuel): Observable<any> {
    return this.httpClient.put<CanvasIndividuel>(
      API_PATH + 'canvasindividuel/update',
      canvasToUpdate
    );
  }

  public resetElementList(): void {
    this.elementList$.next([]);
  }

  public setCanvasCurrentVersion(): Observable<any> {
    return this.httpClient.get(API_PATH + 'excel/canvas/lastversion');
  }

  public incrementCanvasCount() {
    return this.httpClient.put(`${API_PATH}compteur/increment`, {});
  }

  public mapVersion(): string {
    let version = '-';
    if (this.isCanvasHistory$.value) {
      version = version.concat(this.historyCanvas$.value.version ?? '');
    } else if (this.injectCanvas$.value.guidcanvas) {
      version = version.concat(this.injectCanvas$.value.version ?? '');
    } else {
      version = version.concat(this.canvasCurrentVersion$.value);
    }
    if (version.length === 2) {
      version = version.concat('-0');
    }
    version = version.replace(/\./g, '-');
    return version;
  }

  public getPathLabel(pathFile: string, language: string): string {
    return LANG_FILE_PATH + pathFile + '-' + language + this.mapVersion() + '.json';
  }

  public getCanvasLabel(pathFile: string, language: string): Observable<any> {
    const path = this.getPathLabel(pathFile, language);
    return this.httpClient.get(path);
  }

  public getCanvasHeaderLabel(language: string): Observable<HeaderLibelle> {
    return this.getCanvasLabel('canvas-header', language).pipe(
      map((header) => this.mapHeaderJsonToHeaderTs(JSON.stringify(header)))
    );
  }

  public mapHeaderJsonToHeaderTs(objectJson: string): HeaderLibelle {
    let headerLibelle: HeaderLibelle = new HeaderLibelle();
    const jsonObject = JSON.parse(objectJson);
    headerLibelle = {
      headerTitle: jsonObject['canvas-header']['header-title'],
      aideGlobaleEquipe: jsonObject['canvas-header']['aide-globale-equipe'],
      aideGlobaleIndiv: jsonObject['canvas-header']['aide-globale-indiv'],
      canvasTitle: jsonObject['canvas-header']['canvas-title'],
      date: jsonObject['canvas-header']['date'],
      help: jsonObject['canvas-header']['help'],
    };
    return headerLibelle;
  }

  public getCanvasToolTipLabel(language: string, canvasType: string): Observable<CanvasToolTip> {
    return this.getCanvasLabel('canvas-' + canvasType, language).pipe(
      map((canvas) => this.mapIndivJsonToIndivTs(JSON.stringify(canvas), language, canvasType))
    );
  }

  public mapIndivJsonToIndivTs(
    objectJson: string,
    language: string,
    canvasType: string
  ): CanvasToolTip {
    let canvasToolTip: CanvasToolTip = new CanvasToolTip();
    const jsonObject = JSON.parse(objectJson);
    canvasToolTip = {
      besoins: jsonObject['besoins-' + canvasType + '-' + language],
      engagements: jsonObject['engagements-' + canvasType + '-' + language],
      motivations: jsonObject['motivations-' + canvasType + '-' + language],
      valeurs: jsonObject['valeurs-' + canvasType + '-' + language],
      vision: jsonObject['vision-' + canvasType + '-' + language],
      raisons: jsonObject['raisons-' + canvasType + '-' + language],
      strategie: jsonObject['strategie-' + canvasType + '-' + language],
      organisation: jsonObject['organisation-' + canvasType + '-' + language],
      moyens: jsonObject['moyens-' + canvasType + '-' + language],
      competences: jsonObject['competences-' + canvasType + '-' + language],
      tableauBord: jsonObject['tableau-bord-' + canvasType + '-' + language],
      missions: jsonObject['missions-' + canvasType + '-' + language],
    };
    return canvasToolTip;
  }
}
