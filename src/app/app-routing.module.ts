import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrationComponent } from './modules/core/components/administration/administration/administration.component';
import { AdminGuard } from './modules/core/guards/admin.guard';
import { HomeComponent } from './modules/presentation/components/home/home.component';
import { ProfilComponent } from './modules/core/components/profil/profil.component';
import { UserGuard } from './modules/core/guards/user.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profil', component: ProfilComponent, canActivate: [UserGuard] },
  { path: 'admin', component: AdministrationComponent, canActivate: [AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AdminGuard, UserGuard],
})
export class AppRoutingModule {}
