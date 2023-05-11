<script setup lang="ts">
import { isIRestApiErrorResponse } from '@/dto/IRestApiErrorResponse';

import type { IGame } from '@/dto/domain/IGame';
import router from '@/router';
import { GameService } from '@/services/GameService';
import { ref } from 'vue';

const props = defineProps({
    id: String
});
if (!props.id) {
    router.push("/"); // TODO: Error page
}

const game = ref(null as IGame | null);
const error = ref(null as string | null);

const gameService = new GameService();
gameService.getById(props.id!).then(fetchedGame => {
    if (!isIRestApiErrorResponse(fetchedGame) && fetchedGame !== undefined) {
        game.value = fetchedGame;
    }
})

const submit = async (event: MouseEvent) => {
    event.preventDefault();
    if (!game.value) {
        return;
    }

    const success = await gameService.deleteById(game.value?.id);
    if (success) {
        await router.push('/Crud/Game');
    } else {
        error.value = "Failed to delete";
    }
}

</script>

<template>
    <template v-if="game">
        <h1>Delete</h1>
        <div v-if="error" class="text-danger">{{ error }}</div>
        <h3>Are you sure you want to delete this?</h3>
        <div>
            <h4>Game</h4>
            <hr />
            <dl class="row">
                <dt class="col-sm-2">
                    IgdbId
                </dt>
                <dd class="col-sm-10">
                    {{ game.igdbId }}
                </dd>
                <dt class="col-sm-2">
                    Name
                </dt>
                <dd class="col-sm-10">
                    {{ game.name }}
                </dd>
                <dt class="col-sm-2">
                    BoxArtUrl
                </dt>
                <dd class="col-sm-10">
                    {{ game.boxArtUrl }}
                </dd>
                <dt class="col-sm-2">
                    Etag
                </dt>
                <dd class="col-sm-10">
                    {{ game.etag }}
                </dd>
                <dt class="col-sm-2">
                    LastFetched
                </dt>
                <dd class="col-sm-10">
                    {{ game.lastFetched.toLocaleString() }}
                </dd>
                <dt class="col-sm-2">
                    LastSuccessfulFetch
                </dt>
                <dd class="col-sm-10">
                    {{ game.lastSuccessfulFetch?.toLocaleString() }}
                </dd>
            </dl>

            <button @click="submit" class="btn btn-danger">Delete</button>
            <RouterLink to="/Crud/Game">Back to List</RouterLink>
        </div>
    </template>
    <div v-else>LOADING GAME</div>
</template>