<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const type = route.query.type?.toString();
const platform = route.query.platform?.toString();
const idOnPlatform = route.query.idOnPlatform?.toString();

</script>

<template>
    <div>
        <div>
            Submission for {{ type }} on platform {{ platform }} with ID {{ idOnPlatform }} successfully processed.
        </div>
    </div>
</template>