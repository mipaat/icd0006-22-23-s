<script setup lang="ts">
export interface IProps {
    page: number,
    currentPage: number,
}

defineProps<IProps>();
</script>

<template>
    <button @click="$emit('pageChange', page)"
        :class="{ btn: true, 'btn-primary': page === currentPage, 'btn-outline-primary': page !== currentPage }">
        <slot>
            {{ page + 1 }}
        </slot>
    </button>
</template>