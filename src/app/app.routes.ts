import { Routes } from '@angular/router';
import { Home } from './components/pages/home/home';
import { Default } from './components/layouts/default/default';

export const routes: Routes = [
  { path: '', component: Default, children: [{ path: '', component: Home }] },
];
