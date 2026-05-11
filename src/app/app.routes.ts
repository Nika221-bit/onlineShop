import { Routes } from '@angular/router';
import { Basket } from './basket/basket';
import { AI } from './ai/ai';
import { Products } from './products/products';
import { Account } from './account/account';
import { Page1 } from './page1/page1';

export const routes: Routes = [
    { path: '', component: Page1 },
    { path: 'basket', component: Basket },
    { path: 'ai', component: AI },
    { path: 'products', component: Products },
    { path: 'account', component: Account },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
