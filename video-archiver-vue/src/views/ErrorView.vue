<script setup lang="ts">
import { ref } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';

const route = useRoute();
const error = ref(route.query.error?.toString());

onBeforeRouteUpdate(async (to, from, next) => {
    if (to.name === 'error') {
        error.value = to.query.error?.toString();
    }
    next();
});

</script>

<template>
    <h3 class="text-danger">
        An error occurred!
    </h3>
    <h4 v-if="error">{{ error }}</h4>
</template>