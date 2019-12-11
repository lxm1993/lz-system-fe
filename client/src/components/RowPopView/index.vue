 <template>
  <div>
    <el-popover trigger="hover"
      placement="right">
      <el-button-group>
        <el-button v-for="(item, index) in this.info.operationList"
          :key="index"
          size="mini"
          :type="item.type"
          v-if="fCheckHasPermission(item.pemissionUrl) && !item.isHidden"
          @click="fOperation(item)">{{item.name}}</el-button>
        <el-button size="mini"
          type="info"
          @click="fCopyItem">复制</el-button>
      </el-button-group>
      <template slot="reference">
        <link-component :object="info.detail"></link-component>
      </template>
    </el-popover>
  </div>
</template>
<script>
import linkComponent from './linkComponent.vue'
import {
  copyMixins, detailMixins,
} from '@/mixins/index'
export default {
  mixins: [copyMixins, detailMixins],
  components: { linkComponent },
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          index: -1,
          detail: {
            pemissionUrl: '',
            link: '',
            val: '',
          },
          autoCopy: true,
          operationList: [
            {
              name: '修改',
              link: '',
              isShow: true,
              type: 'primary',
              fOperation: () => { },
              operation: {
                reqFunction: () => { },
                reqParam: {},
                confirmMessage: '',
                emitName: '',
              },
            },
          ],
        }
      },
    },
  },
  methods: {
    fOperation(item) {
      if (item.link) {
        if (item.fOperation) {
          item.fOperation()
          return
        }
        this.$router.push(item.link)
      } else if (item.operation) {
        if (item.operation.confirmMessage) { // 操作前需要确认
          this.$confirm(item.operation.confirmMessage, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            this.fDealOperation(item)
          })
        } else {
          this.fDealOperation(item)
        }
      }
    },
    fDealOperation(item) {
      item.operation.reqFunction(item.operation.reqParam)
        .then(response => {
          if (response.code === 200) {
            this.$emit(item.operation.emitName, this.info.detail.val)
            this.$message({
              message: `${item.name}成功`,
              type: 'success',
            })
          }
        }).catch(e => { })
    },
    fCopyItem() {
      if (this.info.autoCopy) {
        this.$emit('autoCopy', this.info.detail.val)
        return
      }
      this.fCopy(this.info.detail.val)
    },
  },
}
</script>