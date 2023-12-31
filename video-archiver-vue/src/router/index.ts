import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/identity/LoginView.vue';
import RegisterView from '../views/identity/RegisterView.vue';
import SelectAuthorView from '../views/identity/SelectAuthorView.vue';
import PendingApprovalView from '../views/identity/PendingApproval.vue';
import SubmitUrlResultView from '../views/submitUrl/SubmitUrlResult.vue';
import AccessDeniedView from '../views/ForbidView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import ErrorView from '../views/ErrorView.vue';
import ApproveQueueItemsView from '../views/admin/QueueItemsApprovalView.vue';
import ManageUsersView from '../views/admin/ManageUsersView.vue';
import VideoSearchView from '../views/video/VideoSearchView.vue';
import VideoWatchView from '../views/video/VideoWatchView.vue';
import { adminNavigationGuard, loginNavigationGuard } from './identityRedirects';

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
        },
        {
            path: '/accessDenied',
            name: 'accessDenied',
            component: AccessDeniedView,
        },
        {
            path: '/error',
            name: 'error',
            component: ErrorView,
        },
        {
            path: '/notFound',
            name: 'notFound',
            component: NotFoundView,
        },
        {
            path: '/admin',
            name: 'admin',
            beforeEnter: adminNavigationGuard,
            children: [
                {
                    path: 'approveQueueItems',
                    name: 'approveQueueItems',
                    component: ApproveQueueItemsView,
                },
                {
                    path: 'manageUsers',
                    name: 'manageUsers',
                    component: ManageUsersView,
                }
            ]
        },
        {
            path: '/videos/search',
            name: 'videoSearch',
            beforeEnter: loginNavigationGuard,
            component: VideoSearchView,
        },
        {
            path: '/video/watch',
            name: 'videoWatch',
            component: VideoWatchView,
        },
        {
            path: '/:catchAll(.*)*',
            name: 'defaultNotFound',
            component: NotFoundView,
        }
    ]
});

export default router;
