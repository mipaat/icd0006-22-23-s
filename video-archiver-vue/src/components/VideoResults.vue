<script setup lang="ts">
import type { IBasicVideoWithAuthor } from '@/dto/IBasicVideoWithAuthor';
import AuthorSummary from './AuthorSummary.vue';
import LangStringDisplay from './LangStringDisplay.vue';
export interface IProps {
    videos: IBasicVideoWithAuthor[]
}

const props = defineProps<IProps>();

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
                </tr>
            </thead>
            <tbody>
                <tr v-for="video in videos">
                    <td>
                        <LangStringDisplay :lang-string="video.title" /> // TODO: Link to watch page
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
                </tr>
            </tbody>
        </table>
    </div>
</template>