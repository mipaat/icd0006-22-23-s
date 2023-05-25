import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/identity/LoginView.vue';
import RegisterView from '../views/identity/RegisterView.vue';
import SelectAuthorView from '../views/identity/SelectAuthorView.vue';
import PendingApprovalView from '../views/identity/PendingApproval.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/identity/account/login/:returnUrl?',
            name: 'login',
            props: true,
            component: LoginView
        },
        {
            path: '/identity/account/selectAuthor/:returnUrl?',
            name: 'selectAuthor',
            props: true,
            component: SelectAuthorView,
        },
        {
            path: '/identity/account/register',
            name: 'register',
            component: RegisterView
        },
        {
            path: '/identity/account/pendingApproval',
            name: 'pendingApproval',
            component: PendingApprovalView
        },
    ]
});

export default router;
