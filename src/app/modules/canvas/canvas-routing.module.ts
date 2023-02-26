import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGuard } from '../core/guards/user.guard';
import { CanvasContainerComponent } from './components/canvas-container/canvas-container.component';
import { MyCanvasListComponent } from './components/my-canvas-list/my-canvas-list.component';

const routes: Routes = [
  { path: 'canvas', component: CanvasContainerComponent },
  { path: 'my-canvas-list', component: MyCanvasListComponent, canActivate: [UserGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CanvasRoutingModule {}
