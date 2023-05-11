<script setup lang="ts">
import { isIRestApiErrorResponse } from '@/dto/IRestApiErrorResponse';
import type { IGame } from '@/dto/domain/IGame';
import router from '@/router';
import { GameService } from '@/services/GameService';
import { ref } from 'vue';

const props = defineProps({
    id: String
});
const game = ref(null as IGame | null);

const gameService = new GameService();
if (!props.id) {
    router.push("/"); // TODO: Error page
}
gameService.getById(props.id!).then(fetchedGame => {
    if (!isIRestApiErrorResponse(fetchedGame) && fetchedGame !== undefined) {
        game.value = fetchedGame;
    }
})
</script>

<template>
    <template v-if="game">
        <h1>Details</h1>

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
                    {{game.boxArtUrl}}
                </dd>
                <dt class="col-sm-2">
                    Etag
                </dt>
                <dd class="col-sm-10">
                    {{game.etag}}
                </dd>
                <dt class="col-sm-2">
                    LastFetched
                </dt>
                <dd class="col-sm-10">
                    {{game.lastFetched.toLocaleString()}}
                </dd>
                <dt class="col-sm-2">
                    LastSuccessfulFetch
                </dt>
                <dd class="col-sm-10">
                    {{game.lastSuccessfulFetch?.toLocaleString()}}
                </dd>
            </dl>
        </div>
        <div>
            <RouterLink :to="{name: 'crudGameEdit', params: {id: game.id}}">Edit</RouterLink> |
            <RouterLink to="../">Back to List</RouterLink>
        </div>
    </template>
    <div v-else>LOADING GAME</div>
</template>