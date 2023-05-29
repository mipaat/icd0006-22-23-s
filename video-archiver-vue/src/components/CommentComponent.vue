<script setup lang="ts">
import type { IComment } from '@/dto/IComment';
import AuthorSummary from './AuthorSummary.vue';

export interface IProps {
    comment: IComment,
}

const props = defineProps<IProps>();

</script>

<template>
    <AuthorSummary :author="comment.author" />
    <span style="white-space: pre-wrap;">{{ comment.content }}</span>
    <div v-if="comment.replies && comment.replies.length > 0">
        <button type="button" class="btn btn-primary" data-bs-toggle="collapse" :data-bs-target="`#comment-${comment.id}-collapse`"
            aria-expanded="false" aria-controls="comment-@Model.Id-collapse">
            {{ comment.replies.length }} replies
        </button>
        <div class="collapse ms-4" :id="`comment-${comment.id}-collapse`">
            <CommentComponent :key="reply.id" v-for="reply in comment.replies" :comment="reply" />
        </div>
    </div>
</template>