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

interface IPaginationItem {
    page?: number,
    separator?: string,
}

let pagesSelection = [] as IPaginationItem[];

const update = () => {
    pagesSelection = [];
    const selectionAmountToShow = 5;
    if (props.page - Math.ceil(selectionAmountToShow / 2) > 0) {
        pagesSelection.push({ page: 0 });
        pagesSelection.push({ separator: "..." });
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
        }
        pagesSelection.push({ page: page });
        offset++;
        selectedAmount++;
    }
    if (totalPages.value && props.page + selectionAmountToShow / 2 < totalPages.value) {
        pagesSelection.push({ separator: "..." });
        pagesSelection.push({ page: totalPages.value });
    }
};

onBeforeUpdate(update);
onBeforeMount(update);

</script>

<template>
    <div v-if="!isOnlyPage(total, limit) && !(page == 0 && amountOnPage < limit)">
        <div class="d-flex gap-1">
            <div :key="index" v-for="(selectionPage, index) in pagesSelection">
                <PaginationButton v-if="selectionPage.page !== undefined" :page="selectionPage.page" :current-page="page"
                    @page-change="$emit('page-change', selectionPage.page)" />
                <span class="rounded-3 p-2" v-else-if="selectionPage.separator !== undefined">{{ selectionPage.separator
                }}</span>
            </div>
            <PaginationButton :page="page + 1" :current-page="page" v-if="!total && amountOnPage >= limit"
                @page-change="$emit('page-change', page + 1)">Next</PaginationButton>
        </div>
        <div v-if="total">
            Showing {{ limit * page + 1 }}-{{ limit * page + amountOnPage }} of {{ total }} results
        </div>
        <div v-else-if="amountOnPage < limit && page === 0">
            {{ amountOnPage }} results
        </div>
        <div v-else>
            Showing {{ limit * page + 1 }}-{{ limit * page + amountOnPage }} results (of unknown total)
        </div>
    </div>
    <div v-else>
        {{ amountOnPage }} results
    </div>
</template>