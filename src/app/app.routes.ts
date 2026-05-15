import { Routes } from '@angular/router';
import { Basket } from './basket/basket';
import { AI } from './ai/ai';
import { Products } from './products/products';
import { Page1 } from './page1/page1';
import { SignIn } from './sign-in/sign-in';
import { SignUp } from './sign-up/sign-up';
import { VerifyEmail } from './verify-email/verify-email';
import { Profile } from './profile/profile';

export const routes: Routes = [
    { path: '', component: Page1 },
    { path: 'basket', component: Basket },
    { path: 'ai', component: AI },
    { path: 'products', component: Products },
    { path: 'account', component: Profile },
    { path: 'profile', component: Profile },
    { path: 'sign-in', component: SignIn },
    { path: 'sign-up', component: SignUp },
    { path: 'verify-email', component: VerifyEmail },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
