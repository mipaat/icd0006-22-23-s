<script setup lang="ts">
import type { IComment } from '@/dto/IComment';
import AuthorSummary from './AuthorSummary.vue';

export interface IProps {
    comment: IComment,
}

defineProps<IProps>();

</script>

<template>
    <AuthorSummary :author="comment.author" />
    <div v-if="comment.createdAt">{{ comment.createdAt.toLocaleString() }}</div>
    <div class="text-danger" v-if="comment.deletedAt">Deleted: {{ comment.deletedAt }}</div>
    <div style="white-space: pre-wrap;">{{ comment.content }}</div>
    <div v-if="comment.likeCount !== null">Likes: {{ comment.likeCount }}</div>
    <div v-if="comment.replies && comment.replies.length > 0">
        <button type="button" class="btn btn-primary" data-bs-toggle="collapse" :data-bs-target="`#comment-${comment.id}-collapse`"
            aria-expanded="false" aria-controls="comment-@Model.Id-collapse">
            Replies ({{ comment.replies.length }})
        </button>
        <div class="collapse ms-4" :id="`comment-${comment.id}-collapse`">
            <CommentComponent :key="reply.id" v-for="reply in comment.replies" :comment="reply" />
        </div>
    </div>
</template>