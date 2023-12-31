<script setup lang="ts">
import type { IVideoWithAuthor } from '@/dto/IVideoWithAuthor';
import { redirectToError } from '@/router/redirects';
import { VideoService } from '@/services/VideoService';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import * as configJson from '@/config.json';
import { type IConfig, conformApiBaseUrl } from '@/config';
import { ESimplePrivacyStatus } from '@/dto/enums/ESimplePrivacyStatus';
import { FileService } from '@/services/FileService';
import AuthorSummary from '@/components/AuthorSummary.vue';
import LangStringDisplay from '@/components/LangStringDisplay.vue';
import type { IComment } from '@/dto/IComment';
import { CommentService } from '@/services/CommentService';
import PaginationComponent from '@/components/PaginationComponent.vue';
import CommentComponent from '@/components/CommentComponent.vue';
import { useIdentityStore } from '@/stores/identityStore';

const config = configJson as IConfig;

const identityStore = useIdentityStore();

const route = useRoute();
const id = route.query.id?.toString();

const embedView = ref(route.query.embedView?.toString().toLowerCase() === true.toString());

const video = ref(null as IVideoWithAuthor | null);
const videoService = new VideoService();
const fileService = new FileService();
let intervalId = null as number | null;

const internalPrivacyStatus = ref(null as ESimplePrivacyStatus | null);
const waitForAccessToken = ref(true);

const commentService = new CommentService();
const comments = ref(null as IComment[] | null);
const commentsLimit = 50;
const commentsPage = ref(0);

const updateComments = async (page: number) => {
    if (!video.value || !id) return;
    comments.value = await commentService.getVideoComments(id, commentsLimit, page);
};

const onCommentsPageChange = async (page: number) => {
    await updateComments(page);
    commentsPage.value = page;
};

onMounted(async () => {
    if (!id) {
        return await redirectToError('Video ID not specified');
    }
    const fetchedVideo = await videoService.getById(id);
    internalPrivacyStatus.value = fetchedVideo.internalPrivacyStatus;
    if (fetchedVideo.internalPrivacyStatus === ESimplePrivacyStatus.Private) {
        await fileService.getVideoAccessToken();
        intervalId = setInterval(() => fileService.getVideoAccessToken(), 55000);
    }
    waitForAccessToken.value = false;
    video.value = fetchedVideo;
    if (fetchedVideo.lastCommentsFetch) {
        await updateComments(commentsPage.value);
    }
});

onUnmounted(() => {
    if (intervalId !== null) {
        clearInterval(intervalId);
    }
});

const videoCanBeEmbedded = (video: IVideoWithAuthor) => {
    return video.embedUrl != null || video.url != null;
};

const showEmbedView = (video: IVideoWithAuthor) => {
    return embedView.value && videoCanBeEmbedded(video);
};

const submitPrivacyStatus = async (event: MouseEvent | Event) => {
    event.preventDefault();
    if (!video.value || !internalPrivacyStatus.value) return;
    await videoService.setPrivacyStatus(video.value.id, internalPrivacyStatus.value);
    video.value.internalPrivacyStatus = internalPrivacyStatus.value;
    if (internalPrivacyStatus.value === ESimplePrivacyStatus.Private) {
        await fileService.getVideoAccessToken();
        intervalId = setInterval(() => fileService.getVideoAccessToken(), 55000);
    } else if (intervalId !== null) {
        clearInterval(intervalId);
    }
};
</script>

<template>
    <div v-if="!video">LOADING...</div>
    <div v-else>
        <RouterLink
            v-if="videoCanBeEmbedded(video)"
            :to="{
                name: 'videoWatch',
                query: { id: video.id, embedView: (!embedView).toString() }
            }"
            @click="embedView = !embedView"
        >
            <div v-if="embedView">View archived version</div>
            <div v-else>View on platform</div>
        </RouterLink>
        <div>
            <iframe
                v-if="showEmbedView(video)"
                width="560"
                height="315"
                :src="video.embedUrl ?? video.url ?? undefined"
                :title="`${video.platform} video player`"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"
                allowfullscreen
            ></iframe>
            <video v-else-if="!waitForAccessToken" controls width="560" height="315">
                <source :src="`${conformApiBaseUrl(config)}v1/File/VideoFileJwt/${video.id}`" />
            </video>
            <div v-else class="text-center" :style="{ width: 560, height: 315 }">
                Fetching video file
            </div>
            <AuthorSummary :author="video.author" />
            <br />
            <h1>
                <LangStringDisplay :lang-string="video.title" />
            </h1>
        </div>
        <div>
            <form v-if="identityStore.jwt?.isAdmin">
                <label for="status">Set privacy status (in archive)</label>
                <select id="status" v-model="internalPrivacyStatus">
                    <option
                        :key="value"
                        :selected="video.internalPrivacyStatus === value"
                        v-for="value in Object.values(ESimplePrivacyStatus)"
                    >
                        {{ value }}
                    </option>
                </select>
                <input
                    type="submit"
                    class="btn btn-primary"
                    value="Submit"
                    @click="(event) => submitPrivacyStatus(event)"
                />
            </form>
            <span class="card card-body" style="white-space: pre-wrap">
                <LangStringDisplay :lang-string="video.description"></LangStringDisplay>
            </span>
        </div>
        <div v-if="comments">
            <h4>Comments</h4>
            <h6 v-if="video.lastCommentsFetch">
                Last fetched: {{ video.lastCommentsFetch.toLocaleString() }}
            </h6>
            <br />
            Comments on platform: {{ video.commentCount }} Archived root comments:
            {{ video.archivedRootCommentCount }} Archived total comments:
            {{ video.archivedCommentCount }}
            <PaginationComponent
                v-on:page-change="onCommentsPageChange"
                :page="commentsPage"
                :limit="commentsLimit"
                :total="video.archivedRootCommentCount"
                :amount-on-page="comments.length"
            ></PaginationComponent>
            <br />
            <CommentComponent :comment="comment" :key="comment.id" v-for="comment in comments" />
        </div>
        <div v-else-if="video.lastCommentsFetch">Loading comments...</div>
        <div v-else><h4>Comments not archived yet</h4></div>
    </div>
</template>
