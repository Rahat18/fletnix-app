import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ShowsComponent } from './shows/shows.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: 'registration', component: UserRegistrationComponent },
  { path: '', component: HomepageComponent },
  { path: 'shows', component: ShowsComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
