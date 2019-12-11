<template>
  <el-tag
    :type="status === 0 ? 'success': 'danger'"
    size="small"
    disable-transitions
  >
    {{ status | statu }}
  </el-tag>
</template>
<script>
export default { props: ['status'] }
</script>
