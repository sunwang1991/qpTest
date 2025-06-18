import useDictStore from '@/store/modules/dict';
import { getDicts } from '@/api/system/dict/data';

/**
 * 获取字典数据
 */
export function useDict(...args) {
  const res = ref({});
  return (() => {
    args.forEach((dictType, index) => {
      res.value[dictType] = [];
      const dicts = useDictStore().getDict(dictType);
      if (dicts) {
        res.value[dictType] = dicts;
      } else {
        getDicts(dictType).then(resp => {
          res.value[dictType] = resp.data.map(p => {
            // 兼容老版本的字典数据格式
            if (p.tagType === 'error') {
              p.tagType = 'danger';
            }
            if (p.tagType === 'processing') {
              p.tagType = 'primary';
            }

            return {
              label: p.dataLabel,
              value: p.dataValue,
              tagType: p.tagType,
              tagClass: p.tagClass,
            };
          });
          useDictStore().setDict(dictType, res.value[dictType]);
        });
      }
    });
    return toRefs(res.value);
  })();
}
