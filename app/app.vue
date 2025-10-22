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
        </NuxtLayout>
    </div>
</template>