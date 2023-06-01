<script setup lang="ts">
import type { IAuthor } from '@/dto/IAuthor';
import {getNameDisplay} from '@/dto/IAuthor';

export interface IProps {
    author: IAuthor,
}

const props = defineProps<IProps>();
</script>

<template>
    <div class="gap-1 d-flex">
        <div class="d-inline-block">
            <img v-if="author.profileImages?.length ?? 0 > 0" v-lazy="author.profileImages![0].url" width="40" height="40"
                alt="Author profile image" />
        </div>
        <div class="d-inline-block">
            <a v-if="author.urlOnPlatform" :href="author.urlOnPlatform">{{ getNameDisplay(author) }}</a>
            <span v-else>{{ getNameDisplay(author) }}</span>
        </div>
    </div>
</template>