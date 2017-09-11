import {MapComponent} from "./map/map.component";
import {ReportComponent} from "./report/report.component";
import {LoginComponent} from "./login/login.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {ForgotPasswordComponent, ForgotPasswordStep2Component} from "./forgot-password/forgot-password.component";

export const Routes = [
  { path: '', component: MapComponent },
  { path: 'report', component: ReportComponent},
  { path: 'login', component: LoginComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'forgot-password/:username', component: ForgotPasswordStep2Component},
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: '**', component: MapComponent}
];
