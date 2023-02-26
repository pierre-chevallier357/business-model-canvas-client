export class Element {
  guidelement?: number;
  caseCanvas: number;
  contenu: string;

  constructor(caseCanvas: number, contenu: string, guidelement?: number) {
    this.guidelement = guidelement;
    this.caseCanvas = caseCanvas;
    this.contenu = contenu;
  }
}
