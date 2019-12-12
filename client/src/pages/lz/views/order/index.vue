<template>
  <div>home22</div>
</template>
<script>
import { fTest } from '@/api/home'
export default {
  data() {
    return {}
  },
  created() {
    fTest().then(res => { })
  },
}
</script>
