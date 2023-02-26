import { User } from './user';
import { Element } from './element';

export interface CanvasIndividuel {
  version: string;
  dateCreation?: Date;
  dateModification?: Date;
  nom: string;
  statutModification: Statut;
  utilisateurDto: User;
  allElements: Element[];
  guidcanvas?: number;
}

export interface CanvasEquipe {
  version: string;
  dateCreation: string;
  dateModification: Date;
  nom: string;
  codeInvitation: string;
  statut: Statut;
  allElements: any[];
  allAssociations: any[];
  guidcanvas: number;
  utilisateur: User;
}

export interface Canvas {
  version: number;
  dateCreation: Date;
  dateModification: Date;
  nom: string;
  statut: Statut;
  allElements: Element[];
  guidcanvas: number;
  utilisateur: User;
  allAssociations?: any[];
  codeInvitation?: string;
  type: CanvaType;
}

export enum Statut {
  cree = 'Créé',
  enCours = 'En cours',
  termine = 'Terminé',
}

export enum CanvaType {
  'Collectif',
  'Individuel',
}
