
import {MapComponent} from "./components/map/map.component";

export const Routes = [
  { path: 'home', component: MapComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full'},
];
