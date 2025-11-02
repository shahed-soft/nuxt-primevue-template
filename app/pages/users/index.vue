<script setup>
import {onMounted, ref} from 'vue';
import {usePaginatedDataFetch} from "~/composables/usePaginatedDataFetch.js";
import { useConfirmation } from '~/composables/useConfirmation.js';

definePageMeta({
    middleware: 'auth',
})

const { confirmDelete } = useConfirmation();

const users = ref();
const userDialog = ref(false);
const user = ref({});

const {items, loading, fetchData, pagination} = usePaginatedDataFetch('user/data')
onMounted(async () => {
    await fetchData();
    users.value = items;
});

function openNew(userData = {}) {
    user.value = userData;
    userDialog.value = true;
}

function hideDialog() {
    userDialog.value = false;
}

function handleUserSaved() {
    fetchData();
    user.value = {};
}

function confirmDeleteUser(prod) {
    user.value = prod;
    confirmDelete({
        endpoint: `user/${prod.id}`,
        resourceName: 'user',
        onSuccess: () => {
            fetchData();
            user.value = {};
        }
    });
}


</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6 border-0">
                <template #end>
                    <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNew"/>
                </template>
            </Toolbar>

            <DataTable :value="items" tableStyle="min-width: 50rem" :loading="loading">
                <Column field="name" header="Name"></Column>
                <Column field="email" header="Email"></Column>
                <Column header="Actions">
                    <template #body="{data}">
<!--                        <Button icon="pi pi-pencil" severity="primary" class="mr-2" @click="openNew(data)"></Button>-->
                        <Button icon="pi pi-trash" severity="danger" @click="confirmDeleteUser(data)"></Button>
                    </template>
                </Column>
            </DataTable>
            <Paginator @page="pagination.setPage" :rows="pagination.rowCount.value"
                       :totalRecords="pagination.total.value"
                       :rowsPerPageOptions="pagination.rowsOptions.value">
            </Paginator>
        </div>

        <UserCreateUpdateModal
            v-if="userDialog"
            v-model:visible="userDialog"
            :user="user"
            @saved="handleUserSaved"
            @hide="hideDialog"
        />


    </div>
</template>
