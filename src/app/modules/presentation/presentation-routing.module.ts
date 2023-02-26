import { ConditionsComponent } from './components/conditions/conditions.component';
import { PolicyComponent } from './components/policy/policy.component';
import { MentionsComponent } from './components/mentions/mentions.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './components/error/error.component';
import { FaqComponent } from './components/faq/faq.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'mentions', component: MentionsComponent },
  { path: 'privacy-policy', component: PolicyComponent },
  { path: 'terms-conditions', component: ConditionsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PresentationRoutingModule {}
