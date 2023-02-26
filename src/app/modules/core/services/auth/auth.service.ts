import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ConnectedUser, User } from '../../../shared/models/user.model';
interface ConnectedUserInterface {
  prenom: string;
  nom: string;
  mail: string;
  password: string;
  entreprise: string;
}

const AUTH_API = 'https://startupfoundercanvas.alwaysdata.net/api/';

var currentUserSource = new BehaviorSubject<string | null>(null);

var currentUser$ = currentUserSource.asObservable();

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public userIsConnected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isAdmin$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  connected = false;
  connexionDialogIsOpen = false;

  constructor(private http: HttpClient, private router: Router) {
    this.getIsAdmin();
  }

  login(mail: string, password: string): Observable<any> {
    return this.http
      .post<ConnectedUser>(
        AUTH_API + 'utilisateur/login',
        {
          mail,
          password,
        },
        httpOptions
      )
      .pipe(
        map((response: ConnectedUser) => {
          const user = response;
          if (user) {
            //JSON.stringify(user)
            localStorage.setItem('token', user.token);
            currentUserSource.next(user.token);
            this.userIsConnected$.next(true);
            this.isAdmin$.next(user.estAdmin);
            this.connected = true;
          }
        })
      );
  }

  register(
    prenom: string,
    nom: string,
    mail: string,
    password: string,
    entreprise: string
  ): Observable<any> {
    const monInstance: ConnectedUserInterface = {
      prenom: prenom,
      nom: nom,
      mail: mail,
      password: password,
      entreprise: entreprise,
    };
    return this.http.post<ConnectedUser>(AUTH_API + 'utilisateur/register', monInstance).pipe(
      map((response: ConnectedUser) => {
        const user = response;
        if (user) {
          //JSON.stringify(user)
          localStorage.setItem('token', user.token);
          currentUserSource.next(user.token);
          this.userIsConnected$.next(true);
          this.connected = true;
        }
      })
    );
  }

  setCurrentUser(token: string) {
    this.userIsConnected$.next(true);
    currentUserSource.next(token);
  }

  logout(): Observable<any> {
    localStorage.removeItem('token');
    currentUserSource.next(null);
    this.isAdmin$.next(false);
    this.connected = false;
    this.router.navigate(['']);
    this.userIsConnected$.next(false);
    return this.http.post(AUTH_API + 'signout', {}, httpOptions);
  }

  addTokenInStorage(token: string) {
    window.localStorage.setItem('token', token);
  }

  public getCurrentUser() {
    return currentUser$;
  }

  isConnected() : Observable<boolean>{
    const token = localStorage.getItem('token');
    return this.http.get<boolean>(AUTH_API + 'utilisateur/isUser?token='+ token);
  }

  isAdmin() : Observable<boolean>{
    const token = localStorage.getItem('token');
    return this.http.get<boolean>(AUTH_API + 'utilisateur/isAdmin?token='+ token);
  }

  private getIsAdmin() {
    const token = localStorage.getItem('token');
    return this.http
      .get<User>(AUTH_API + `utilisateur?token=${token}`)
      .pipe(take(1))
      .subscribe((result) => {
        if (result) {
          this.isAdmin$.next(result.estAdmin);
          this.connected = true;
        }
      });
  }

  sendResetMail(mail: string): Observable<any> {
    return this.http.get(AUTH_API + 'reset/user?mail=' + mail);
  }

  resetPassword(mail: string, code: string, password: string): Observable<any> {
    return this.http.get(
      AUTH_API + 'reset?mail=' + mail + '&code=' + code + '&password=' + password
    );
  }

  openConnexionDialog() {
    this.connexionDialogIsOpen = true;
  }

  closeConnexionDialog() {
    this.connexionDialogIsOpen = false;
  }

  verifyCaptcha(response: string): Observable<any> {
    return this.http.get(AUTH_API + 'captcha/verifier?response=' + response);
  }
}
