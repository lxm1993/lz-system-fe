<template>
  <el-dialog class="create-dia-wrap"
    :title="title|| '新建'"
    :visible.sync="diaVisible"
    :width="width || '45%'"
    @close="fHidden"
    :destroy-on-close="true">
    <create-view v-model="model"
      ref="createRef"
      :formItems="formItems"
      :hiddenButtons="true"
      label-position="right"
      label-width="120px"></create-view>
    <span slot="footer"
      class="dialog-footer">
      <el-button @click="fHidden"
        size="medium">取 消</el-button>
      <el-button type="primary"
        size="medium"
        @click="fSave">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import CreateView from '../CreateView'
import { detailMixins } from '@/mixins'

export default {
  components: { CreateView },
  mixins: [detailMixins],
  props: {
    formItems: { type: Array },
    title: { type: String },
    value: { type: Object },
    visible: { type: Boolean },
    width: { type: String },
  },
  computed: {
    model: {
      get: function () {
        return this.value
      },
      set: function (val) {
        this.$emit('input', val)
      },
    },
    diaVisible: {
      get: function () {
        return this.visible
      },
      set: function (val) {
        this.$emit('update:visible', val)
      },
    },
  },
  methods: {
    fSave() {
      this.fVelidateForm(this.$refs.createRef.$refs.form, () => {
        this.$emit('submit')
      })
    },
    fHidden() {
      this.model = {}
      // this.$refs.createRef.$refs.form.resetFields()
      this.$emit("hidden");
    },
  },
}
</script>
<style lang="scss">
.create-dia-wrap {
  .el-dialog__body {
    // height: 110px;
    padding: 10px 5px 0;
    .create-view-wrap {
      width: 100%;
    }
  }
}
</style>
