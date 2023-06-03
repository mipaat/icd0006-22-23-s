<script setup lang="ts">
import type { IQueueItemForApproval } from '@/dto/IQueueItemForApproval';
import { QueueItemApprovalService } from '@/services/admin/QueueItemApprovalService';
import { onBeforeMount, ref } from 'vue';

const queueItems = ref(null as IQueueItemForApproval[] | null);
const queueItemApprovalService = new QueueItemApprovalService();

onBeforeMount(async () => {
    queueItems.value = await queueItemApprovalService.listAll();
});

const deleteQueueItem = async (event: MouseEvent, queueItem: IQueueItemForApproval) => {
    event.preventDefault();
    await queueItemApprovalService.deleteQueueItem(queueItem.id);
    if (queueItems.value) {
        const index = queueItems.value.indexOf(queueItem);
        if (index != -1) {
            queueItems.value.splice(index, 1);
        }
    }
}

const approveQueueItem = async (event: MouseEvent | Event, queueItem: IQueueItemForApproval) => {
    event.preventDefault();
    await queueItemApprovalService.approveQueueItem(queueItem.id, queueItem.grantAccess);
    if (queueItems.value) {
        const index = queueItems.value.indexOf(queueItem);
        if (index != -1) {
            queueItems.value.splice(index, 1);
        }
    }
}
</script>

<template>
    <div class="text-center">
        <h2 class="text-center mb-3">Queue items awaiting approval</h2>
        <template v-if="!queueItems">
            Loading...
        </template>
        <template v-else>
            <div :key="queueItem.id" v-for="(queueItem) in queueItems" class="dashboard-item">
                {{ queueItem.entityType }} on platform {{ queueItem.platform }}
                Id on platform: {{ queueItem.idOnPlatform }}
                Added at: {{ queueItem.addedAt }}
                Added by: {{ queueItem.addedBy }}
                ID: {{ queueItem.id }}
                <input type="submit" class="btn btn-danger" value="Delete"
                    @click="event => deleteQueueItem(event, queueItem)" />
                <form>
                    <label :for="`grantAccess-${queueItem.id}`">Grant submitter access?</label>
                    <input type="checkbox" :id="`grantAccess-${queueItem.id}`" v-model="queueItem.grantAccess" />
                    <input type="submit" @click="event => approveQueueItem(event, queueItem)"
                        class="btn btn-success" value="Approve" />
                </form>
            </div>
        </template>
    </div>
</template>

<style scoped>
.dashboard-item {
    border-radius: 0.35rem;
    padding: 1rem;
    background-color: #d9f6ff;
}
</style>