<script setup lang="ts">
import { EVideoSortingOptions } from '@/dto/enums/EVideoSortingOptions';
import type { IVideoSearchQuery } from '@/dto/input/IVideoSearchQuery';
import { useIdentityStore } from '@/stores/identityStore';
import { onBeforeMount, ref } from 'vue';
import { onBeforeRouteUpdate, useRoute, type RouteLocationNormalized } from 'vue-router';
import { VideoService } from '@/services/VideoService';
import { EPlatform } from '@/dto/enums/EPlatform';
import { conformLimit, conformPage } from '@/utils/PaginationUtils';
import type { IVideoSearchResult } from '@/dto/IVideoSearchResult';
import PaginationComponent from '@/components/PaginationComponent.vue';
import router from '@/router';
import CategoryPicker from '@/components/CategoryPicker.vue';
import VideoResults from '@/components/VideoResults.vue';

const route = useRoute();
const identityStore = useIdentityStore();

const parseCategoryIdsQuery = (route: RouteLocationNormalized): string[] => {
    if (!route.query.categoryIdsQuery) return [];
    return route.query.categoryIdsQuery.toString().split(",");
}

const parsePlatformQuery = (route: RouteLocationNormalized): EPlatform | null => {
    if (!route.query.platformQuery) return null;
    if (route.query.platformQuery.toString() in EPlatform) {
        return route.query.platformQuery as EPlatform;
    }
    return null;
}

const parseSortingOptions = (route: RouteLocationNormalized): EVideoSortingOptions => {
    if (!route.query.sortingOptions) return EVideoSortingOptions.CreatedAt;
    if (route.query.sortingOptions.toString() in EVideoSortingOptions) {
        return route.query.sortingOptions as EVideoSortingOptions;
    }
    return EVideoSortingOptions.CreatedAt;
}

const query = ref({} as IVideoSearchQuery);

const videoService = new VideoService();

const searchResult = ref(null as IVideoSearchResult | null);

const refreshQuery = (route: RouteLocationNormalized) => {
    query.value = {
        categoryIdsQuery: parseCategoryIdsQuery(route),
        userAuthorId: identityStore.selectedAuthor?.id ?? null,
        platformQuery: parsePlatformQuery(route),
        nameQuery: route.query.nameQuery?.toString() ?? null,
        authorQuery: route.query.authorQuery?.toString() ?? null,
        page: route.query.page ? conformPage(parseInt(route.query.page!.toString())) : 0,
        limit: route.query.limit ? conformLimit(parseInt(route.query.limit!.toString())) : 50,
        sortingOptions: parseSortingOptions(route),
        descending: route.query.descending ? (route.query.descending.toString().toLowerCase() !== false.toString()) : true,
    }
};

const refresh = async (route: RouteLocationNormalized) => {
    refreshQuery(route);
    searchResult.value = await videoService.search(query.value);
};

onBeforeMount(async () => {
    await refresh(route);
});

onBeforeRouteUpdate(async (to, from, next) => {
    if (to.path === from.path) {
        await refresh(to);
    }
    next();
});

const onPageChange = async (page: number) => {
    const query = { ...route.query, page: page };
    await router.push({ name: route.name ?? undefined, query: query });
};

const onSearchSubmit = async (event: Event | MouseEvent) => {
    event.preventDefault();
    const newQuery = new Map<string, string>();

    if (query.value.nameQuery) {
        newQuery.set("nameQuery", query.value.nameQuery);
    }
    if (query.value.authorQuery) {
        newQuery.set("authorQuery", query.value.authorQuery);
    }
    if (query.value.platformQuery) {
        newQuery.set("platformQuery", query.value.platformQuery);
    }
    if (query.value.categoryIdsQuery && query.value.categoryIdsQuery.length > 0) {
        newQuery.set("categoryIdsQuery", query.value.categoryIdsQuery.join(","));
    }

    newQuery.set("page", query.value.page.toString());
    newQuery.set("limit", query.value.limit.toString());
    newQuery.set("sortingOptions", query.value.sortingOptions);
    newQuery.set("descending", query.value.descending.toString());

    await router.push({ name: route.name ?? undefined, query: Object.fromEntries(newQuery) });
}

</script>

<template>
    <form @submit="onSearchSubmit">
        <label for="NameQuery">Search video name:</label>
        <input id="NameQuery" v-model="query.nameQuery">
        <label for="AuthorQuery">Search author name:</label>
        <input id="AuthorQuery" v-model="query.authorQuery" />
        <label for="SortingOptions">Sort by</label>
        <select id="SortingOptions" v-model="query.sortingOptions">
            <option @select="query.sortingOptions = value" :selected="query.sortingOptions === value"
                v-for="value in Object.values(EVideoSortingOptions)">{{ value }}</option>
        </select>
        <label for="Descending">Sort descending</label>
        <input type="checkbox" id="Descending" v-model="query.descending" />
        <CategoryPicker :selected-category-ids="query.categoryIdsQuery" />
        <input type="submit" class="btn btn-primary" @click="onSearchSubmit" value="Search" />
    </form>
    <PaginationComponent :page="query.page" :limit="query.limit" :total="null"
        :amount-on-page="searchResult?.videos.length ?? 0" v-on:page-change="onPageChange" />
    <VideoResults v-if="searchResult?.videos !== undefined" :videos="searchResult?.videos" />
    <div v-else>Loading videos</div>
</template>