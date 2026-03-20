import { Routes } from '@angular/router';
import { Home } from './components/pages/home/home';
import { Default } from './components/layouts/default/default';
import { ExamGenerator } from './components/pages/exam-generator/exam-generator';

export const routes: Routes = [
  {
    path: '',
    component: Default,
    children: [
      { path: '', component: Home },
      { path: 'examens', component: ExamGenerator },
    ],
  },
];
