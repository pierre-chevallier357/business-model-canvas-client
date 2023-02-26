import { MyCanvasListComponent } from './components/my-canvas-list/my-canvas-list.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { RouterModule } from '@angular/router';
import { CanvasRoutingModule } from './canvas-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasContainerComponent } from './components/canvas-container/canvas-container.component';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BoxComponent } from './components/box/box.component';
import { SidebarModule } from 'primeng/sidebar';
import { CanvasHistoryComponent } from './components/canvas-history/canvas-history.component';
import { ListboxModule } from 'primeng/listbox';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  imports: [
    CommonModule,
    CanvasRoutingModule,
    RouterModule,
    TooltipModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule,
    ListboxModule,
    DialogModule,
    TableModule,
    ConfirmDialogModule,
    InputTextModule,
  ],
  declarations: [
    CanvasComponent,
    CanvasContainerComponent,
    BoxComponent,
    CanvasHistoryComponent,
    MyCanvasListComponent,
  ],
  providers: [TranslateService],
  exports: [CanvasComponent],
})
export class CanvasModule {}
