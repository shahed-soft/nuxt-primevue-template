<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useHttp } from '~/composables/useHttp.js';

const props = defineProps({
    visible: {
        type: Boolean,
        required: true
    },
    user: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update:visible', 'saved', 'hide']);

const toast = useToast();
const { httpPost } = useHttp();
const submitted = ref(false);
const errors = ref({});

onMounted(() => {
    console.log(`props.user`, props.user);
})
const handleSave = async () => {
    submitted.value = true;
    try {
        const { success, message } = await httpPost('user/create', props.user);
        if (success) {
            toast.add({ severity: 'success', summary: 'Successful', detail: message, life: 3000 });
            emit('saved');
            emit('update:visible', false);
            submitted.value = false;
            errors.value = {};
        }
    } catch (error) {
        console.log(`error`, error.data);
        errors.value = error.data.errors;
        toast.add({ severity: 'error', summary: 'Error!', detail: error.data?.message, life: 3000 });
    }
};

const handleHide = () => {
    emit('hide');
    emit('update:visible', false);
    submitted.value = false;
    errors.value = {};
};
</script>

<template>
    <Dialog :visible="visible" @update:visible="emit('update:visible', $event)" :style="{ width: '450px' }" header="User Details" :modal="true">
        <div class="flex flex-col gap-6">
            <img v-if="user.image" :src="`${user.image}`"
                 :alt="user.image" class="block m-auto pb-4"/>
            <div>
                <label for="name" class="block font-bold mb-3">Name</label>
                <InputText id="name" v-model.trim="user.name" required="true" autofocus fluid/>
                <small v-if="submitted && errors?.name" class="text-red-500">{{ errors.name[0] }}</small>
            </div>
            <div>
                <label for="email" class="block font-bold mb-3">Email</label>
                <InputText id="email" v-model="user.email" required="true" rows="3" cols="20" fluid/>
                <small v-if="submitted && errors?.email" class="text-red-500">{{ errors.email[0] }}</small>
            </div>
            <div>
                <label for="password" class="block font-bold mb-3">Password</label>
                <Password v-model="user.password" toggleMask :feedback="false" fluid/>
                <small v-if="submitted && errors?.password" class="text-red-500">{{ errors.password[0] }}</small>
            </div>
        </div>

        <template #footer>
            <Button label="Cancel" icon="pi pi-times" text @click="handleHide"/>
            <Button label="Save" icon="pi pi-check" @click="handleSave"/>
        </template>
    </Dialog>
</template>
