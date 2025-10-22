<script setup>
definePageMeta({
    middleware: 'auth',
})
const authStore = useAuthStore();
const user = computed(() => authStore.user);
</script>

<template>
    <div>
        <h1 class="">Welcome, {{ user?.name }}</h1>

    </div>
</template>
