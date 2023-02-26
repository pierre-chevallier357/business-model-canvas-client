import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { PopUpComponent } from './components/popup/popup.component';

@NgModule({
  imports: [CommonModule, ToastModule],
  declarations: [PopUpComponent],
  exports: [PopUpComponent],
})
export class SharedModule {}
