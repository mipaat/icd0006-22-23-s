<script setup lang="ts">
import type { ICategoryWithCreator } from '@/dto/ICategoryWithCreator';
import { EPlatform } from '@/dto/enums/EPlatform';
import { CategoryService } from '@/services/CategoryService';
import { useIdentityStore } from '@/stores/identityStore';
import { onMounted, ref } from 'vue';
import LangStringDisplay from './LangStringDisplay.vue';

export interface IProps {
    selectedCategoryIds: string[],
}

const props = defineProps<IProps>();
const emits = defineEmits<{
    (e: 'update:selectedCategoryIds', value: string[]): void
}>();

const categoryService = new CategoryService();
const categories = ref(null as Map<EPlatform, ICategoryWithCreator[]> | null);
const identityStore = useIdentityStore();

onMounted(async () => {
    categories.value = await categoryService.listAllCategoriesGroupByPlatform(identityStore.selectedAuthor?.id ?? null);
});

const isPublicArchiveCategory = (category: ICategoryWithCreator) =>
    category.isPublic && category.platform === EPlatform.This;
const isSelectedAuthorCreatedCategory = (category: ICategoryWithCreator) =>
    identityStore.selectedAuthor && category.creator && identityStore.selectedAuthor.id === category.creator.id;

const toggleCategorySelect = (category: ICategoryWithCreator) => {
    const index = props.selectedCategoryIds.findIndex(i => i === category.id);
    const updatedCategoryIds = [...props.selectedCategoryIds];
    if (index === -1) {
        updatedCategoryIds.push(category.id);
    } else {
        updatedCategoryIds.splice(index, 1);
    }
    emits('update:selectedCategoryIds', updatedCategoryIds);
}

</script>

<template>
    <div v-if="categories">
        <button type="button" class="btn btn-primary" data-bs-toggle="collapse" data-bs-target="#category-collapse"
            aria-expanded="false" aria-controls="category-collapse">
            Category filter
        </button>
        <div class="collapse" id="category-collapse">
            <div :key="platform" v-for="platform in categories.keys()">
                <button type="button" class="btn btn-outline-dark" data-bs-toggle="collapse"
                    :data-bs-target="`#category-${platform}-collapse`" aria-expanded="false"
                    :aria-controls="`category-${platform}-collapse`">
                    {{ platform }}
                </button>
                <div class="collapse" :id="`category-${platform}-collapse`">
                    <template :key="category.id" v-for="category in categories.get(platform)">
                        <label :for="`category-${category.id}`">
                            <a v-if="isSelectedAuthorCreatedCategory(category)">
                                {{ isPublicArchiveCategory(category) ? "(Public) " : "" }}
                                <LangStringDisplay :lang-string="category.name" />
                            </a>
                            <a v-else>
                                {{ isPublicArchiveCategory(category) ? "(Public) " : "" }}
                                <LangStringDisplay :lang-string="category.name" />
                            </a>
                        </label>
                        <input :id="`category-${category.id}`" type="checkbox"
                        :checked="props.selectedCategoryIds.includes(category.id)" @click="toggleCategorySelect(category)" />
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>