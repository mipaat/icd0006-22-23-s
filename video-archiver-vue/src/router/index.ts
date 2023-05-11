import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/identity/LoginView.vue';
import RegisterView from '../views/identity/RegisterView.vue';
import CrudGameIndexView from '../views/crud/game/IndexView.vue';
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
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView
        },
        {
            path: '/pendingApproval',
            name: 'pendingApproval',
            component: PendingApprovalView
        },
        {
            path: '/crud/game',
            name: 'crudGameIndex',
            component: CrudGameIndexView
        },
        {
            path: '/crud/game/create',
            name: 'crudGameCreate',
            component: () => import('../views/crud/game/CreateView.vue')
        },
        {
            path: '/crud/game/details/:id',
            name: 'crudGameDetails',
            props: true,
            component: () => import('../views/crud/game/DetailsView.vue')
        },
        {
            path: '/crud/game/edit/:id',
            name: 'crudGameEdit',
            props: true,
            component: () => import('../views/crud/game/EditView.vue')
        },
        {
            path: '/crud/game/delete/:id',
            name: 'crudGameDelete',
            props: true,
            component: () => import('../views/crud/game/DeleteView.vue')
        }
    ]
});

export default router;
