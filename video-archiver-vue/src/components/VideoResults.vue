<script setup lang="ts">
import type { IBasicVideoWithAuthor } from '@/dto/IBasicVideoWithAuthor';
import AuthorSummary from './AuthorSummary.vue';
import LangStringDisplay from './LangStringDisplay.vue';
export interface IProps {
    videos: IBasicVideoWithAuthor[]
}

defineProps<IProps>();

</script>

<template>
    <div>
        <table class="table">
            <thead>
                <tr>
                    <th>Video</th>
                    <th>Author</th>
                    <th>Thumbnail</th>
                    <th>Duration</th>
                    <th>Created at</th>
                    <th>Added to archive at</th>
                </tr>
            </thead>
            <tbody>
                <tr :key="video.id" v-for="video in videos">
                    <td>
                        <RouterLink :to="{ name: 'videoWatch', query: { id: video.id } }">
                            <LangStringDisplay :lang-string="video.title" />
                        </RouterLink>
                    </td>
                    <td>
                        <AuthorSummary :author="video.author" />
                    </td>
                    <td>
                        <img v-if="video.thumbnail" v-lazy="video.thumbnail.url" width="160" height="90" alt="Thumbnail" />
                        <div v-else>No thumbnails</div>
                    </td>
                    <td>
                        {{ video.duration }}
                    </td>
                    <td>
                        {{ (video.publishedAt ?? video.createdAt)?.toLocaleString() }}
                    </td>
                    <td>
                        {{ video.addedToArchiveAt.toLocaleString() }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>