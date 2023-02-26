import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { DatePipe } from '@angular/common';
import { Canvas, CanvaType } from '../../canvas/models/canvas';

@Injectable({
  providedIn: 'root',
})
export class AdministrationService {
  static readonly URL: string = 'https://startupfoundercanvas.alwaysdata.net/api/';

  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  getAllUsers(
    page: number,
    sortColumn: string,
    sortWay: string,
    nom: string,
    prenom: string,
    mail: string,
    entreprise: string,
    admin: string
  ) {
    let param = '';
    if (sortColumn !== '' && sortColumn !== undefined && sortColumn !== null) {
      param += `&sortColumn=${sortColumn}`;
    }
    if (sortWay !== '' && sortWay !== undefined && sortWay !== null) {
      param += `&sortWay=${sortWay}`;
    }
    if (nom !== '' && nom !== undefined && nom !== null) {
      param += `&nom=${nom}`;
    }
    if (prenom !== '' && prenom !== undefined && prenom !== null) {
      param += `&prenom=${prenom}`;
    }
    if (mail !== '' && mail !== undefined && mail !== null) {
      param += `&mail=${mail}`;
    }
    if (entreprise !== '' && entreprise !== undefined && entreprise !== null) {
      param += `&entreprise=${entreprise}`;
    }
    if (admin !== '' && admin !== undefined && admin !== null) {
      param += `&admin=${admin}`;
    }
    return this.http.get<any[]>(
      AdministrationService.URL +
        `utilisateur/all?tokenAdmin=${localStorage.getItem('token')}&page=${page}${param}`
    );
  }

  deleteUser(user: User) {
    return this.http.delete(
      AdministrationService.URL + `utilisateur/deleteByToken?token=${user.token}`
    );
  }

  putAdmin(idUtilisateur: number, admin: boolean) {
    return this.http.patch<boolean>(
      AdministrationService.URL +
        `utilisateur/grant?idUtilisateur=${idUtilisateur}&admin=${admin}&adminToken=${localStorage.getItem(
          'token'
        )}`,
      {}
    );
  }

  getAllCanvas(
    page: number,
    sortColumn: string,
    sortWay: string,
    nom: string,
    statut: string,
    version: string,
    dateStart: Date | undefined,
    dateEnd: Date | undefined,
    userFirstname: string,
    userLastname: string,
    entreprise: string,
    type: string
  ) {
    let param = '';
    if (sortColumn !== '' && sortColumn !== undefined && sortColumn !== null) {
      param += `&sortColumn=${sortColumn}`;
    }
    if (sortWay !== '' && sortWay !== undefined && sortWay !== null) {
      param += `&sortWay=${sortWay}`;
    }
    if (nom !== '' && nom !== undefined && nom !== null) {
      param += `&nom=${nom}`;
    }
    if (statut !== '' && statut !== undefined && statut !== null) {
      param += `&statut=${statut}`;
    }
    if (version !== '' && version !== undefined && version !== null) {
      param += `&version=${Number(version)}`;
    }
    if (dateStart !== undefined && dateStart !== null) {
      param += `&dateStart=${this.datePipe.transform(dateStart, 'yyyy-MM-dd')}`;
    }
    if (dateEnd !== undefined && dateEnd !== null) {
      param += `&dateEnd=${this.datePipe.transform(dateEnd, 'yyyy-MM-dd')}`;
    }
    if (userFirstname !== '' && userFirstname !== undefined && userFirstname !== null) {
      param += `&prenomUser=${userFirstname}`;
    }
    if (userLastname !== '' && userLastname !== undefined && userLastname !== null) {
      param += `&nomUser=${userLastname}`;
    }
    if (entreprise !== '' && entreprise !== undefined && entreprise !== null) {
      param += `&entreprise=${entreprise}`;
    }
    if (type !== '' && type !== undefined && type !== null) {
      param += `&type=${type}`;
    }
    return this.http.get<any[]>(
      AdministrationService.URL +
        `canvas/all?tokenAdmin=${localStorage.getItem('token')}&page=${page}${param}`
    );
  }

  deleteCanvas(canvas: Canvas) {
    if (String(canvas.type) === 'INDIVIDUEL') {
      return this.http.delete(
        AdministrationService.URL +
          `canvasindividuel/delete?token=${localStorage.getItem('token')}&guidcanvas=${
            canvas.guidcanvas
          }`
      );
    } else {
      return this.http.delete(
        AdministrationService.URL +
          `canvascollectif/delete?token=${localStorage.getItem('token')}&guidcanvas=${
            canvas.guidcanvas
          }`
      );
    }
  }

  getCanvasInitCount() {
    return this.http.get(
      AdministrationService.URL + `compteur/initie?adminToken=${localStorage.getItem('token')}`
    );
  }

  getCanvasSavedCount() {
    return this.http.get(
      AdministrationService.URL + `compteur/save?adminToken=${localStorage.getItem('token')}`
    );
  }
}
