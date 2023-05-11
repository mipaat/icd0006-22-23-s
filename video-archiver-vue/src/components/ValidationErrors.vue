<script setup lang="ts">
export interface IProps {
    errors: string[]
}

const props = defineProps<IProps>();
</script>

<template>
    <ul :class="{ 'd-none': props.errors.length === 0 }">
        <li v-for="(item) in props.errors" :key="item">
            {{ item }}
        </li>
    </ul>
</template>