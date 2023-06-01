<script setup lang="ts">
import { isOnlyPage } from '@/utils/PaginationUtils';
import PaginationButton from './PaginationButton.vue';
import { onBeforeMount, onBeforeUpdate } from 'vue';
import { computed } from 'vue';

export interface IProps {
    page: number,
    limit: number,
    total: number | null,
    amountOnPage: number,
}

const props = defineProps<IProps>();

const totalPages = computed(() => {
    if (props.total === null) return null;
    return Math.ceil(props.total / props.limit);
});

const pageRangeStart = computed(() => {
    return props.limit * props.page + 1;
});

const pageRangeEnd = computed(() => {
    return props.limit * props.page + props.amountOnPage;
});

interface IPaginationItem {
    page: number,
    previousPage?: number | null,
}

let pagesSelection = [] as IPaginationItem[];

const update = () => {
    pagesSelection = [];
    let maxAddedPage = 0;
    let previousPage = null as number | null;
    const selectionAmountToShow = 5;
    if (props.page - Math.ceil(selectionAmountToShow / 2) > 0) {
        pagesSelection.push({ page: 0 });
        previousPage = 0;
    }
    let selectedAmount = 0;
    let offset = 0;
    while (selectedAmount < selectionAmountToShow) {
        const page = props.page - Math.ceil(selectionAmountToShow / 2) + offset;
        if (page < 0) {
            offset++;
            continue;
        }
        if (totalPages.value && page >= totalPages.value) {
            break;
        }
        if (!totalPages.value && page > props.page) {
            break;
        }
        if (pagesSelection.some(p => p.page === page)) {
            offset++;
            continue;
        }
        maxAddedPage = page;
        pagesSelection.push({ page: page, previousPage: previousPage });
        previousPage = page;
        offset++;
        selectedAmount++;
    }
    if (totalPages.value && maxAddedPage < totalPages.value - 1) {
        pagesSelection.push({ page: totalPages.value, previousPage: previousPage });
        previousPage = totalPages.value;
    }
};

onBeforeUpdate(update);
onBeforeMount(update);

</script>

<template>
    <div v-if="!isOnlyPage(total, limit) && !(page === 0 && amountOnPage < limit)">
        <div class="d-flex gap-1">
            <div :key="index" v-for="(selectionPage, index) in pagesSelection">
                <span class="rounded-3 p-2" v-if="
                    selectionPage.previousPage !== undefined
                    && selectionPage.previousPage !== null
                    && selectionPage.previousPage + 1 < selectionPage.page">
                    ...
                </span>
                <PaginationButton :page="selectionPage.page" :current-page="page"
                    @page-change="$emit('page-change', selectionPage.page)" />
            </div>
            <PaginationButton :page="page + 1" :current-page="page" v-if="!total && amountOnPage >= limit"
                @page-change="$emit('page-change', page + 1)">Next</PaginationButton>
        </div>
        <div v-if="amountOnPage === 0">
            0 results on page
        </div>
        <div v-else-if="total">
            Showing {{ pageRangeStart }}-{{ pageRangeEnd }} of {{ total }} results
        </div>
        <div v-else-if="amountOnPage < limit">
            Showing {{ pageRangeStart }}-{{ pageRangeEnd }} of {{ pageRangeEnd }} results
        </div>
        <div v-else>
            Showing {{ pageRangeStart }}-{{ pageRangeEnd }} results (of unknown total)
        </div>
    </div>
    <div v-else>
        Results: {{ amountOnPage }}
    </div>
</template>