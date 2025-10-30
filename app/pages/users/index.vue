<script setup>
import {useToast} from 'primevue/usetoast';
import {onMounted, ref} from 'vue';
import {usePaginatedDataFetch} from "~/composables/usePaginatedDataFetch.js";
import {useHttp} from "~/composables/useHttp.js";

definePageMeta({
    middleware: 'auth',
})

const toast = useToast();
const confirm = useConfirm();
const {httpPost, httpDelete} = useHttp();

const dt = ref();
const users = ref();
const userDialog = ref(false);
const user = ref({});
const errors = ref([]);
const submitted = ref(false);

const {items, loading, fetchData, pagination} = usePaginatedDataFetch('user/data')
onMounted(async () => {
    await fetchData();
    users.value = items;
});

function openNew() {
    user.value = {};
    submitted.value = false;
    userDialog.value = true;
}

function hideDialog() {
    userDialog.value = false;
    submitted.value = false;
}

const saveUser = async () => {
    submitted.value = true;
    try {
        const {success, message} = await httpPost('user/create', user.value);
        if (success) {
            fetchData();
            toast.add({severity: 'success', summary: 'Successful', detail: message, life: 3000});
            userDialog.value = false;
            user.value = {};
        }
    } catch (error) {
        console.log(`error`, error.data);
        errors.value = error.data.errors;
        toast.add({severity: 'error', summary: 'Error!', detail: error.data?.message, life: 3000});
    }
}

function confirmDeleteUser(prod) {
    console.log(`prod`, prod);
    user.value = prod;
    confirm.require({
        message: 'Do you want to delete this record?',
        header: 'Attention',
        icon: 'pi pi-info-circle',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept: () => {
            deleteUser(prod.id);
        },
        reject: () => {
            user.value = {};
        }
    });
}

const deleteUser = async (id) => {
    try {
        const {success, message} = await httpDelete(`user/${id}`);
        if (success) {
            fetchData();
            toast.add({severity: 'success', summary: 'Successful', detail: message, life: 3000});
            user.value = {};
        }
    } catch (error) {
        console.log(`error`, error.data);
        toast.add({severity: 'error', summary: 'Error!', detail: error.data?.message, life: 3000});
    }
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

            <DataTable :value="items" tableStyle="min-width: 50rem">
                <Column field="name" header="Name"></Column>
                <Column field="email" header="Email"></Column>
                <Column header="Actions">
                    <template #body="{data}">
                        <!--                        <Button label="Edit" icon="pi pi-pencil" severity="secondary" class="mr-2"></Button>-->
                        <Button icon="pi pi-trash" severity="danger" @click="confirmDeleteUser(data)"></Button>
                    </template>
                </Column>
            </DataTable>
            <Paginator @page="pagination.setPage" :rows="pagination.rowCount.value"
                       :totalRecords="pagination.total.value"
                       :rowsPerPageOptions="pagination.rowsOptions.value"></Paginator>
        </div>

        <Dialog v-model:visible="userDialog" :style="{ width: '450px' }" header="user Details" :modal="true">
            <div class="flex flex-col gap-6">
                <img v-if="user.image" :src="`${user.image}`"
                     :alt="user.image" class="block m-auto pb-4"/>
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model.trim="user.name" required="true" autofocus fluid/>
                    <small v-if="submitted && errors['name']" class="text-red-500">{{ errors['name'][0] }}</small>
                </div>
                <div>
                    <label for="email" class="block font-bold mb-3">Email</label>
                    <InputText id="email" v-model="user.email" required="true" rows="3" cols="20" fluid/>
                    <small v-if="submitted && errors['email']" class="text-red-500">{{ errors['email'][0] }}</small>

                </div>
                <div>
                    <label for="email" class="block font-bold mb-3">Password</label>
                    <Password v-model="user.password" toggleMask :feedback="false" fluid/>
                    <small v-if="submitted && errors['password']" class="text-red-500">{{
                            errors['password'][0]
                        }}</small>

                </div>
                <!--                <div>-->
                <!--                    <label for="inventoryStatus" class="block font-bold mb-3">Inventory Status</label>-->
                <!--                    <Select id="inventoryStatus" v-model="user.inventoryStatus" :options="statuses" optionLabel="label" placeholder="Select a Status" fluid></Select>-->
                <!--                </div>-->
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog"/>
                <Button label="Save" icon="pi pi-check" @click="saveUser"/>
            </template>
        </Dialog>


    </div>
</template>
