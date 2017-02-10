
import {MapComponent} from "./map/map.component";

export const Routes = [
  { path: '', component: MapComponent },
  { path: '**', component: MapComponent}
];
