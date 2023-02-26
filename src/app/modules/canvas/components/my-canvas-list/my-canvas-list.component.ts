import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CanvasIndividuel } from 'src/app/modules/canvas/models/canvas';
import { CanvasService } from 'src/app/modules/canvas/services/canvas/canvas.service';
import { PopupService } from 'src/app/modules/shared/services/popup/popup.service';
@Component({
  selector: 'sfc-my-canvas-list',
  templateUrl: './my-canvas-list.component.html',
  styleUrls: ['./my-canvas-list.component.scss'],
  providers: [ConfirmationService],
})
export class MyCanvasListComponent implements OnInit, OnDestroy {
  public myCanvasList: CanvasIndividuel[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    public translate: TranslateService,
    private canvasService: CanvasService,
    private confirmationService: ConfirmationService,
    private popupService: PopupService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.canvasService
      .getAllCanvasByUserToken(localStorage.getItem('token')!)
      .subscribe((canvasList) => (this.myCanvasList = canvasList));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  deleteIndividualCanvas(canvasToDelete: CanvasIndividuel): void {
    this.confirmationService.confirm({
      accept: () => {
        const deleteCanvas$ = this.canvasService
          .deleteIndividualCanvas(canvasToDelete.guidcanvas!)
          .subscribe({
            next: (data) => {
              if (data) {
                this.translate
                  .get('popup.canvas.delete-success')
                  .subscribe((msg) => this.popupService.createPopup('is-success', msg));
                this.myCanvasList.splice(this.myCanvasList.indexOf(canvasToDelete), 1);
              }
            },
            error: () => {
              this.translate
                .get('popup.canvas.delete-fail')
                .subscribe((msg) => this.popupService.createPopup('is-danger', msg));
            },
          });
        this.subscription.add(deleteCanvas$);
      },
    });
  }

  public updateIndividualCanvas(canvas: CanvasIndividuel) {
    this.canvasService.injectCanvas$.next(canvas);
    this.router.navigate(['/canvas']);
  }
}
