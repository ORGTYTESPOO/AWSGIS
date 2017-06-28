import {MapComponent} from "./map/map.component";
import {ReportComponent} from "./report/report.component";
import {LoginComponent} from "./login/login.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";

export const Routes = [
  { path: '', component: MapComponent },
  { path: 'report', component: ReportComponent},
  { path: 'login', component: LoginComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: '**', component: MapComponent}
];
