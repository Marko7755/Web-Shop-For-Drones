import { Routes } from '@angular/router';
import { MainPageComponent } from '../frontend/components/MainPage/main-page/main-page.component';
import { AdministrationComponent } from '../frontend/components/administration/administration.component';
import { DronesComponent } from '../frontend/components/drones/drones.component';
import { DroneDetailsComponent } from '../frontend/components/drone-details/drone-details.component';
import { AuthGuard } from '../frontend/authorization/authGuard/auth.guard';
import { LoginComponent } from '../frontend/authorization/components/login/login.component';
import { RegisterComponent } from '../frontend/authorization/components/register/register.component';
import { DiscountedDronesComponent } from '../frontend/components/discountedDrones/discounted-drones/discounted-drones.component';
import { AboutUsComponent } from '../frontend/components/aboutUs/about-us/about-us.component';

export const routes: Routes = [
    {path: '', component: MainPageComponent},
    {path: 'administration', component: AdministrationComponent, canActivate: [AuthGuard]},
    {path: 'drones', component: DronesComponent},
    {path: 'drone/:id', component: DroneDetailsComponent},
    {path: 'login', component: LoginComponent },
    {path: 'register', component: RegisterComponent },
    {path: 'discounts', component: DiscountedDronesComponent },
    {path: 'about', component: AboutUsComponent}

];
