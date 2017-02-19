import {MapComponent} from "./map/map.component";
import {ReportComponent} from "./report/report.component";

export const Routes = [
  { path: '', component: MapComponent },
  { path: 'report', component: ReportComponent},
  { path: '**', component: MapComponent}
];
