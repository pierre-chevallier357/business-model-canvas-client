import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectedUser } from '../../../shared/models/user.model';
import { AuthService } from '../auth/auth.service';

interface ConnectedUserInterface {
  prenom: string;
  nom: string;
  mail: string;
  olPassword: string;
  newPassword: string;
  entreprise: string;
  token: string;
}

const AUTH_API = 'https://startupfoundercanvas.alwaysdata.net/api/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class ProfilService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getUser(token: string): Observable<any> {
    return this.http.get<ConnectedUser>(AUTH_API + 'utilisateur?token=' + token);
  }

  saveEditProfil(
    mail: string,
    nom: string,
    prenom: string,
    oldpassword: string,
    password: string,
    entreprise: string,
    token: string
  ): Observable<any> {
    const monInstance: ConnectedUserInterface = {
      prenom: prenom,
      nom: nom,
      mail: mail,
      olPassword: oldpassword,
      newPassword: password,
      entreprise: entreprise,
      token: token
    };
    return this.http.put<ConnectedUser>(AUTH_API + 'utilisateur/update', monInstance);
  }

  deleteUser(token: string): Observable<any> {
    return this.http.delete(
      AUTH_API + 'utilisateur/deleteByToken?token='+token
    );
  }
}
