<script setup lang="ts">
import type { IGameData } from '@/dto/domain/IGameData';
import router from '@/router';
import { GameService } from '@/services/GameService';
import { ref } from 'vue';
import { getDateString, getDateFromDateString } from '@/utils/Utils';

const validationErrors = ref(new Array<string>());
const gameData = ref({
    igdbId: "",
    name: "",
    boxArtUrl: "",
    etag: "",
    lastFetched: null as Date | null,
    lastSuccessfulFetch: null as Date | null,
} as IGameData);

const submit = async (event: MouseEvent) => {
    event.preventDefault();
    validationErrors.value = [];

    if (!gameData.value.igdbId) {
        validationErrors.value.push("IgdbID is required");
    }
    if (!gameData.value.name) {
        validationErrors.value.push("Name is required");
    }
    if (!gameData.value.lastFetched) {
        validationErrors.value.push("LastFetched is required");
    }
    if (validationErrors.value.length > 0) {
        return;
    }

    const gameService = new GameService();
    const result = await gameService.create(gameData.value);
    if (result) {
        validationErrors.value.push(result);
        return;
    }

    await router.push("/Crud/Game/");
}

</script>

<template>
    <h1>Edit</h1>

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
                    <input class="form-control" v-model="gameData.igdbId" type="text" id="igdbId" maxLength="16" />
                </div>
                <div class="form-group">
                    <label class="control-label" for="name">Name</label>
                    <input class="form-control" v-model="gameData.name" type="text" id="name" maxLength="512" name="name" />
                </div>
                <div class="form-group">
                    <label class="control-label" for="boxArtUrl">BoxArtUrl</label>
                    <input class="form-control" v-model="gameData.boxArtUrl" type="text" maxLength="4096"
                        name="boxArtUrl" />
                </div>
                <div class="form-group">
                    <label class="control-label" for="etag">Etag</label>
                    <input class="form-control" v-model="gameData.etag" type="text" id="etag" maxLength="4096"
                        name="etag" />
                </div>
                <div class="form-group">
                    <label class="control-label" for="lastFetched">LastFetched</label>
                    <input class="form-control" :value="getDateString(gameData.lastFetched)"
                        @input="gameData.lastFetched = getDateFromDateString(($event.target as HTMLInputElement).value)"
                        type="datetime-local" id="lastFetched" name="lastFetched" />
                </div>
                <div class="form-group">
                    <label class="control-label" for="lastSuccessfulFetch">LastSuccessfulFetch</label>
                    <input class="form-control" :value="getDateString(gameData.lastSuccessfulFetch)"
                        @input="gameData.lastSuccessfulFetch = getDateFromDateString(($event.target as HTMLInputElement).value)"
                        type="datetime-local" id="lastSuccessfulFetch" name="lastSuccessfulFetch" />
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