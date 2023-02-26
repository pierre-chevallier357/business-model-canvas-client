import { Component, OnInit } from '@angular/core';
import { CanvasIndividuel } from '../../models/canvas';
import { CanvasService } from '../../services/canvas/canvas.service';

@Component({
  selector: 'sfc-canvas-history',
  templateUrl: './canvas-history.component.html',
  styleUrls: ['./canvas-history.component.scss'],
})
export class CanvasHistoryComponent implements OnInit {
  public myCanvasList: CanvasIndividuel[] = [];
  public canvasSelected!: CanvasIndividuel;
  public displayModal: boolean = false;

  constructor(private canvasService: CanvasService) {}

  ngOnInit(): void {
    this.canvasService
      .getAllCanvasByUserToken(localStorage.getItem('token')!)
      .subscribe((canvasList) => (this.myCanvasList = canvasList));
  }

  showSelectedCanvas(): void {
    this.displayModal = true;
    this.canvasService.historyCanvas$.next(this.canvasSelected);
    this.canvasService.isCanvasHistory$.next(true);
    this.canvasService.elementReadOnlyList$.next([...this.canvasSelected.allElements]);
  }

  getCanvasName(): string {
    return this.canvasSelected?.nom;
  }

  closeCanvasHistory(): void {
    this.canvasService.isCanvasHistory$.next(false);
  }
}
