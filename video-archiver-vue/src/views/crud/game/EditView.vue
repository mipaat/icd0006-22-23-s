<script setup lang="ts">
import router from '@/router';
import { GameService } from '@/services/GameService';
import { ref } from 'vue';
import type { IGame } from '@/dto/domain/IGame';
import { isIRestApiErrorResponse } from '@/dto/IRestApiErrorResponse';
import { getDateString, getDateFromDateString } from '@/utils/Utils';

const props = defineProps({
    id: String
});
if (!props.id) {
    router.push("/"); // TODO: Error page
}

const validationErrors = ref(new Array<string>());
const game = ref(null as IGame | null);

const gameService = new GameService();
gameService.getById(props.id!).then(fetchedGame => {
    if (!isIRestApiErrorResponse(fetchedGame) && fetchedGame !== undefined) {
        game.value = fetchedGame;
    }
})

const submit = async (event: MouseEvent) => {
    event.preventDefault();
    validationErrors.value = [];

    if (!game.value) {
        validationErrors.value.push("Game data not fetched yet");
        return;
    }

    if (!game.value.igdbId) {
        validationErrors.value.push("IgdbID is required");
    }
    if (!game.value.name) {
        validationErrors.value.push("Name is required");
    }
    if (!game.value.lastFetched) {
        validationErrors.value.push("LastFetched is required");
    }
    if (validationErrors.value.length > 0) {
        return;
    }

    const result = await gameService.update(game.value);
    if (result) {
        validationErrors.value.push(result);
        return;
    }

    await router.push("/Crud/Game/");
}

</script>

<template>
    <h1>Edit</h1>

    <template v-if="game">
        <ul :class="{ 'd-none': validationErrors.length === 0 }">
            <li v-for="(item) in validationErrors" :key="item">
                {{ item }}
            </li>
        </ul>

        <h4>Game</h4>
        <hr />
        <div class="row">
            <div class="col-md-4">
                <form>
                    <div class="form-group">
                        <label class="control-label" for="igdbId">IgdbId</label>
                        <input class="form-control" v-model="game.igdbId" type="text" id="igdbId" maxLength="16" />
                    </div>
                    <div class="form-group">
                        <label class="control-label" for="name">Name</label>
                        <input class="form-control" v-model="game.name" type="text" id="name" maxLength="512" name="name" />
                    </div>
                    <div class="form-group">
                        <label class="control-label" for="boxArtUrl">BoxArtUrl</label>
                        <input class="form-control" v-model="game.boxArtUrl" type="text" maxLength="4096"
                            name="boxArtUrl" />
                    </div>
                    <div class="form-group">
                        <label class="control-label" for="etag">Etag</label>
                        <input class="form-control" v-model="game.etag" type="text" id="etag" maxLength="4096"
                            name="etag" />
                    </div>
                    <div class="form-group">
                        <label class="control-label" for="lastFetched">LastFetched</label>
                        <input class="form-control" :value="getDateString(game.lastFetched)"
                            @input="game ? game.lastFetched = getDateFromDateString(($event.target as HTMLInputElement).value) : null"
                            type="datetime-local"
                            id="lastFetched"
                            name="lastFetched" />
                    </div>
                    <div class="form-group">
                        <label class="control-label" for="lastSuccessfulFetch">LastSuccessfulFetch</label>
                        <input class="form-control" :value="getDateString(game.lastSuccessfulFetch)"
                            @input="game ? game.lastSuccessfulFetch = getDateFromDateString(($event.target as HTMLInputElement).value) : null"
                            type="datetime-local"
                            id="lastSuccessfulFetch"
                            name="lastSuccessfulFetch" />
                    </div>

                    <div class="form-group">
                        <input type="submit" value="Save" class="btn btn-primary" @click="submit" />
                    </div>
                </form>
            </div>
        </div>

        <div>
            <RouterLink to="/Crud/Game">Back to List</RouterLink>
        </div> 
    </template>
    <div v-else>LOADING GAME</div>
</template>