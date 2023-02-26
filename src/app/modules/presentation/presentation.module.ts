import { PolicyComponent } from './components/policy/policy.component';
import { MentionsComponent } from './components/mentions/mentions.component';
import { ConditionsComponent } from './components/conditions/conditions.component';
import { ErrorComponent } from './components/error/error.component';
import { RouterModule } from '@angular/router';
import { PresentationRoutingModule } from './presentation-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
import { FaqComponent } from './components/faq/faq.component';

@NgModule({
  imports: [
    CommonModule,
    PresentationRoutingModule,
    RouterModule,
    TranslateModule,
    AccordionModule,
  ],
  declarations: [
    HomeComponent,
    ErrorComponent,
    FaqComponent,
    ConditionsComponent,
    MentionsComponent,
    PolicyComponent,
  ],
})
export class PresentationModule {}
