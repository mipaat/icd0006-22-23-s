<script setup lang="ts">
import { isOnlyPage } from '@/utils/PaginationUtils';
import PaginationButton from './PaginationButton.vue';
import { onBeforeMount, onBeforeUpdate } from 'vue';

export interface IProps {
    page: number,
    limit: number,
    total: number | null,
    amountOnPage: number,
}

const props = defineProps<IProps>();

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
        if (props.total && page >= props.total) {
            break;
        }
        if (!props.total && page > props.page) {
            break;
        }
        if (pagesSelection.some(p => p.page === page)) {
            offset++;
        }
        pagesSelection.push({ page: page });
        offset++;
        selectedAmount++;
    }
    if (props.total && props.page + selectionAmountToShow / 2 < props.total) {
        pagesSelection.push({ separator: "..." });
        pagesSelection.push({ page: props.total });
    }
};

onBeforeUpdate(update);
onBeforeMount(update);

</script>

<template>
    <div v-if="!isOnlyPage(total, limit) && !(page == 0 && amountOnPage < limit)">
        <div class="d-flex gap-1">
            <div v-for="(selectionPage) in pagesSelection">
                <PaginationButton v-if="selectionPage.page !== undefined" :page="selectionPage.page" :current-page="page"
                    @page-change="$emit('page-change', selectionPage.page)" />
                <span class="rounded-3 p-2" v-else-if="selectionPage.separator !== undefined">{{ selectionPage.separator
                }}</span>
            </div>
            <PaginationButton :page="page + 1" :current-page="page" v-if="!total && amountOnPage >= limit"
                @page-change="$emit('page-change', page + 1)">Next</PaginationButton>
        </div>
        <div v-if="total">
            Showing {{ amountOnPage }} of {{ total }} results
        </div>
        <div v-else-if="amountOnPage < limit && page === 0">
            {{ amountOnPage }} results
        </div>
        <div v-else>
            Showing {{ amountOnPage }} results (of unknown total)
        </div>
    </div>
    <div v-else>
        {{ amountOnPage }} results
    </div>
</template>