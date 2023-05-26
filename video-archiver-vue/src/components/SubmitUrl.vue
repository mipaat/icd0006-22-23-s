<script setup lang="ts">
import { ERestApiErrorType } from '@/dto/ERestApiErrorType';
import { isIRestApiErrorResponse } from '@/dto/IRestApiErrorResponse';
import type { IUrlSubmissionData } from '@/dto/IUrlSubmissionData';
import router from '@/router';
import { UrlSubmissionService } from '@/services/UrlSubmissionService';
import { useIdentityStore } from '@/stores/identityStore';
import { ref } from 'vue';

const urlSubmissionService = new UrlSubmissionService();
const urlSubmissionData = {
    link: "",
    submitPlaylist: false,
} as IUrlSubmissionData;

const identityStore = useIdentityStore();
const displayError = ref(null as string | null);
const submitting = ref(false);

const submit = async (event: MouseEvent | Event) => {
    event.preventDefault();
    displayError.value = null;
    try {
        submitting.value = true;
        const result = await urlSubmissionService.submit(urlSubmissionData);
        await router.push(router.resolve({
            name: "submitUrlResult", query: {
                queueItemId: result.queueItemId,
                type: result.type,
                entityId: result.entityId,
                platform: result.platform,
                idOnPlatform: result.idOnPlatform,
                alreadyAdded: result.alreadyAdded.toString(),
            }
        }))
    } catch (e) {
        submitting.value = false;
        if (isIRestApiErrorResponse(e)) {
            if (e.errorType === ERestApiErrorType.UnrecognizedUrl) {
                displayError.value = "Unrecognized/invalid URL";
            } else {
                displayError.value = e.error;
            }

        } else {
            displayError.value = "Unknown error occurred";
        }
    }
};
</script>

<template>
    <template v-if="identityStore.isLoggedIn">
        <div v-if="!submitting">
            <h2>Add a YouTube link to the archive</h2>
            <form @submit="event => submit(event)">
                <div>
                    <div v-if="displayError" class="text-danger">{{ displayError }}</div>
                    <label for="urlSubmissionLink">Link:</label>
                    <input id="urlSubmissionLink" v-model="urlSubmissionData.link" />
                </div>
                <div>
                    <label for="alsoSubmitPlaylist">Also submit playlist, if link is a video+playlist link:</label>
                    <input id="alsoSubmitPlaylist" type="checkbox" v-model="urlSubmissionData.submitPlaylist" />
                </div>
                <input type="submit" @click="event => submit(event)" value="Submit" class="btn btn-primary" />
            </form>
        </div>
        <div v-else>
            Please wait, submitting URL {{ urlSubmissionData.link }}
        </div>
    </template>
    <template v-else>
        <p>Log in to submit a link to the archive</p>
    </template>
</template>