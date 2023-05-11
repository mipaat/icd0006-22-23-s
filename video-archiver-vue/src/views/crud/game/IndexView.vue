<script setup lang="ts">
import { isIRestApiErrorResponse } from '@/dto/IRestApiErrorResponse';
import type { IGame } from '@/dto/domain/IGame';
import { GameService } from '@/services/GameService';
import { ref } from 'vue';

const games = ref(null as IGame[] | null);
const gameService = new GameService();
gameService.getAll().then(fetchedGames => {
    if (!isIRestApiErrorResponse(fetchedGames) && fetchedGames !== undefined) {
        games.value = fetchedGames;
    }
})
</script>

<template>
    <h1>Index</h1>

    <p>
        <RouterLink :to="{ name: 'crudGameCreate' }">Create New</RouterLink>
    </p>

    <table v-if="games">
        <thead>
            <tr>
                <th>
                    IgdbId
                </th>
                <th>
                    Name
                </th>
                <th>
                    BoxArtUrl
                </th>
                <th>
                    Etag
                </th>
                <th>
                    LastFetched
                </th>
                <th>
                    LastSuccessfulFetch
                </th>
                <th></th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="(game) in games" :key="game.id">
                <td>
                    {{ game.igdbId }}
                </td>
                <td>
                    {{ game.name }}
                </td>
                <td>
                    {{ game.boxArtUrl }}
                </td>
                <td>
                    {{ game.etag }}
                </td>
                <td>
                    {{ game.lastFetched.toLocaleString() }}
                </td>
                <td>
                    {{ game.lastSuccessfulFetch?.toLocaleString() }}
                </td>
                <td>
                    <RouterLink :to="{ name: 'crudGameEdit', params: { id: game.id } }">Edit</RouterLink> | 
                    <RouterLink :to="{ name: 'crudGameDetails', params: { id: game.id } }">Details</RouterLink> | 
                    <RouterLink :to="{ name: 'crudGameDelete', params: { id: game.id } }">Delete</RouterLink>
                </td>
            </tr>
        </tbody>
    </table>
    <div v-else>LOADING GAMES</div>
</template>