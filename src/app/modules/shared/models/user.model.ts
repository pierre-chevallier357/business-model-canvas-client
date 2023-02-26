import { CanvasEquipe, CanvasIndividuel } from '../../canvas/models/canvas';

export interface User {
  prenom: string;
  nom: string;
  mail: string;
  entreprise: string;
  estAdmin: boolean;
  allCanvasIndividuels: CanvasIndividuel[];
  allCanvasEquipe: CanvasEquipe[];
  guidutilisateur: number;
  token?: string;
}

export interface ConnectedUser {
  prenom: string;
  nom: string;
  mail: string;
  entreprise: string;
  estAdmin: boolean;
  token: string;
}
