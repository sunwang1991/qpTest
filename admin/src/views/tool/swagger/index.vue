<template>
   <i-frame v-model:src="url"></i-frame>
</template>

<script setup>
import iFrame from '@/components/iFrame'

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const url = ref(`${baseUrl}/swagger-ui/index.html`);
url.value = 'https://mask-api-midwayjs.apifox.cn/';
</script>
