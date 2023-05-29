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

const config = configJson as IConfig;

const route = useRoute();
const id = route.query.id?.toString();

const embedView = ref(route.query.embedView?.toString().toLowerCase() === true.toString());

const video = ref(null as IVideoWithAuthor | null);
const videoService = new VideoService();
const fileService = new FileService();
onMounted(async () => {
    if (!id) {
        return await redirectToError("Video ID not specified");
    }
    const fetchedVideo = await videoService.getById(id);
    if (fetchedVideo.internalPrivacyStatus === ESimplePrivacyStatus.Private) {
        await fileService.getVideoAccessToken();
        const intervalId = setInterval(fileService.getVideoAccessToken, 55);
        onUnmounted(() => {
            clearInterval(intervalId);
        });
    }
    video.value = fetchedVideo;
});

const videoCanBeEmbedded = (video: IVideoWithAuthor) => {
    return video.embedUrl != null || video.url != null;
}

const showEmbedView = (video: IVideoWithAuthor) => {
    return embedView.value && videoCanBeEmbedded(video);
}

</script>

<template>
    <div v-if="!video">LOADING...</div>
    <div v-else>
        // TODO: Embed toggle
        <div>
            <iframe v-if="showEmbedView(video)" width="560" height="315" :src="video.embedUrl ?? video.url ?? undefined"
                :title="`${video.platform} video player`"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen></iframe>
            <video v-else controls width="560" height="315">
                <source :src="`${conformApiBaseUrl(config)}v1/File/VideoFileJwt/${video.id}`" />
            </video>
        </div>
    </div>
</template>