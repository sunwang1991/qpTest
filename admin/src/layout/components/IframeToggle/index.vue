<template>
  <TransitionGroup name="fade-transform">
    <InnerLink
      v-for="(item, index) in tagsViewStore.iframeViews"
      :key="item.path"
      :iframeId="'iframe' + index"
      v-show="route.path === item.path"
      :src="item.meta.link"
    ></InnerLink>
  </TransitionGroup>
</template>

<script setup>
import InnerLink from '../InnerLink/index';
import useTagsViewStore from '@/store/modules/tagsView';

const route = useRoute();
const tagsViewStore = useTagsViewStore();
</script>
