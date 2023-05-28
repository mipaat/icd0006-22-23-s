<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const error = route.query.error?.toString();
</script>

<template>
    <h3 class="text-danger">
        An error occurred!
    </h3>
    <h4 v-if="error">{{ error }}</h4>
</template>