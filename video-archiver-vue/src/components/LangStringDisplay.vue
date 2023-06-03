<script setup lang="ts">
import type { LangString } from '@/dto/LangString';

export interface IProps {
    langString: LangString | null,
}
defineProps<IProps>();
</script>

<template>
    {{ langString?.translate() }}
</template>