import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import VueLazyload from 'vue-lazyload';

import errorImage from './assets/Error.png';
import loadingImage from './assets/loading.gif';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(VueLazyload, {
    loading: loadingImage,
    error: errorImage,
})

app.mount('#app');
