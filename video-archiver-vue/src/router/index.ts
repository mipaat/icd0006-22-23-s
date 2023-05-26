import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/identity/LoginView.vue';
import RegisterView from '../views/identity/RegisterView.vue';
import SelectAuthorView from '../views/identity/SelectAuthorView.vue';
import PendingApprovalView from '../views/identity/PendingApproval.vue';
import SubmitUrlResultView from '../views/submitUrl/SubmitUrlResult.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/identity/account/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/identity/account/selectAuthor',
            name: 'selectAuthor',
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
        {
            path: '/submitUrl/result',
            name: 'submitUrlResult',
            component: SubmitUrlResultView,
        }
    ]
});

export default router;
