import {MapComponent} from "./map/map.component";
import {ReportComponent} from "./report/report.component";
import {LoginComponent} from "./login/login.component";

export const Routes = [
  { path: '', component: MapComponent },
  { path: 'report', component: ReportComponent},
  { path: 'login', component: LoginComponent },
  { path: '**', component: MapComponent}
];
