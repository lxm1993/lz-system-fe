<template>
  <div class="create_view_multi">
    <div v-for="(item, index) in model"
      :key="index"
      v-bind="config.attrs"
      class="time-pick-item">
      <el-time-select v-model="item[0]"
        placeholder="起始时间"
        :picker-options="timePikOptions"
        class="time-pick-select"></el-time-select>
      至
      <el-time-select v-model="item[1]"
        placeholder="结束时间"
        :picker-options="timePikOptions"
        class="time-pick-select"></el-time-select>
      <el-button @click="fAddNew(index)"
        :icon="index === 0 ? 'el-icon-circle-plus-outline' : 'el-icon-delete'"
        type="danger"
        circle
        class="add-del-btn"></el-button>
    </div>
  </div>
</template>
<script>
import TimePicker from './TimePickerComponent.vue'
export default {
  name: 'MultiTime',
  components: { TimePicker },
  data() {
    return {
      timePikOptions: {
        start: '00:00',
        // step: '00:10',
        end: '24:00'
      }
    }
  },
  props: {
    value: {
      type: Array,
    },
    config: {
      type: Object,
      default: () => {
        return {
          type: 'MultiTime',
          prop: 'MultiTime',
          formItemAttrs: {
            label: 'MultiTime',
            rules: [
              {
                required: true, message: '请输入', trigger: 'blur',
              },
            ],
          },
          attrs: {
            style: 'width: 550px'
          },
        }
      },
    },
  },
  computed: {
    model: {
      get: function () {
        return this.value || []
      },
      set: function (val) {
        this.$emit('input', val)
      },
    },
  },
  mounted() {
    if (this.model.length === 0) {
      this.fAddNew(0)
    }
  },
  methods: {
    fAddNew(index) {
      if (index === 0) {
        // 限制可增加个数
        if (this.model.length >= (this.config.length || 5)) {
          return
        }
        // 新增
        this.model = this.model || []
        this.model.push([])
        console.log(this.model)
      } else { // 删除
        this.model.splice(index, 1)
        this.model = [...this.model]
      }
    },
  },
}
</script>
<style lang="scss">
.create_view_multi {
  max-width: 600px;
  .time-pick-item {
    margin-bottom: 10px;
  }
  .time-pick-select {
    display: inline-block;
    width: 160px;
  }
  .add-del-btn {
    margin-left: 10px;
    padding: 6px;
  }
}
</style>
