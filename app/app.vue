<script setup>
const authStore = useAuthStore();
onMounted(async () => {
    await authStore.fetchUser();
});
</script>
<template>
    <div>
        <NuxtLayout>
            <NuxtPage />
            <Toast />
            <ConfirmDialog></ConfirmDialog>
        </NuxtLayout>
    </div>
</template>