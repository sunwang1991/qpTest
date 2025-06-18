<template>
  <div :style="'height:' + height">
    <iframe
      :id="iframeId"
      style="width: 100%; height: 100%"
      :src="iframeSrc"
      frameborder="no"
    ></iframe>
  </div>
</template>

<script setup>
import { isValid, decode } from 'js-base64';
import { isHttp } from '@/utils/validate';
import { useRoute } from 'vue-router';
const route = useRoute();

let iframeSrc = ref("");

const props = defineProps({
  src: {
    type: String,
    default: "/"
  },
  iframeId: {
    type: String
  }
});

const height = ref(document.documentElement.clientHeight - 94.5 + "px");

// 设置链接地址
if (route.name) {
  const name = route.name.toString();
  const pathArr = route.matched.concat().map(i => i.path);
  const pathLen = pathArr.length;
  let path = pathArr[pathLen - 1].replace(pathArr[pathLen - 2], '');
  path = path.substring(1);
  if (isValid(path)) {
    const url = decode(path);
    if (isHttp(url)) {
      iframeSrc.value = url;
    } else {
      let endS = name.substring(4, 5).endsWith('s');
      iframeSrc.value = `${endS ? 'https://' : 'http://'}${url}`;
    }
  }
}
</script>
