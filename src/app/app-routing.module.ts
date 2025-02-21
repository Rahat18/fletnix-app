import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ShowsComponent } from './shows/shows.component';

const routes: Routes = [
  {path:'registration' , component:UserRegistrationComponent},
  {path:'' , component:HomepageComponent},
  {path:'shows' , component:ShowsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
