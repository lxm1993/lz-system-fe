<template>
  <div>
    <create-view v-model="data"
      :formItems="formItems"
      :buttons="buttons"
      label-position="right"
      label-width="120px"></create-view>
  </div>
</template>
<script>
import CreateView from '@/components/CreateView'
export default {
  components: { CreateView },
  data() {
    return {
      data: {
        // multiInput: [{}],
        input: 24
      },
      formItems: [
        {
          type: 'Section',
          title: '测试',
          prop: 'section'
        },
        {
          type: 'Input',
          prop: 'input',
          formItemAttrs: {
            label: 'input',
            rules: [
              {
                required: true, message: '请输入', trigger: 'blur',
              },
            ],
          },
          attrs: {
            placeholder: '请输入input',
            clearable: true,
          },
        },
        {
          type: 'Select',
          prop: 'select',
          formItemAttrs: {
            label: 'select',
            rules: [
              {
                required: true, message: '请输入', trigger: 'blur',
              },
            ],
          },
          attrs: {
            placeholder: '请输入',
            clearable: true,
          },
          listGetter: {
            url: '/basemappings',
            params: { datatype: 'plat' },
            keyMap: { list: 'data' },
            data: [],
            optionValue: 'map_value',
            optionName: 'map_name',
          }
          // data: [
          //   {
          //     datavalue: '1',
          //     dataname: '搜狐视频',
          //   }
          // ]
        },
        {
          type: 'CheckBox',
          prop: 'checkBox',
          formItemAttrs: {
            label: 'checkBox',
            rules: [
              {
                required: true, message: '请输入', trigger: 'blur',
              },
            ],
          },
          attrs: {
            placeholder: '请输入',
            clearable: true,
            separator: '/',
            props: { multiple: true },
            //  style: 'width: 400px'
          },
          listGetter: {
            url: '/basemappings',
            params: { datatype: 'plat' },
            keyMap: { list: 'data' },
            data: [],
            optionValue: 'map_value',
            optionName: 'map_name',
            optionValueUseIndex: true,
          }
        },
        {
          type: 'Cascader',
          prop: 'cascader',
          formItemAttrs: {
            label: 'cascader',
            rules: [
              {
                required: true, message: '请输入', trigger: 'blur',
              },
            ],
          },
          attrs: {
            placeholder: '请输入',
            clearable: true,
            separator: '/',
            props: { multiple: true },
            //  style: 'width: 400px'
          },
          listGetter: {
            url: '/basemappings',
            params: { datatype: 'plat' },
            keyMap: { list: 'data' },
            data: [],
            optionValue: 'map_value',
            optionName: 'map_name',
            optionValueUseIndex: true,
          }
        },
        {
          type: 'DataPicker',
          prop: 'dataPicker',
          formItemAttrs: {
            label: 'dataPicker',
            rules: [
              {
                required: true, message: '请输入', trigger: 'blur',
              },
            ],
          },
          attrs: {
            clearable: true,
            // type: 'date',
            // format: 'yyyy-MM-dd',
            // 'value-format': 'yyyy-MM-dd'
            type: 'datetimerange',
            'start-placeholder': '开始日期',
            'end-placeholder': '结束日期',
            format: 'yyyy-MM-dd HH:mm:ss',
            'value-format': 'yyyy-MM-dd HH:mm:ss'

          },
        },
        {
          type: 'FileUpload',
          prop: 'fileUpload',
          formItemAttrs: {
            label: 'fileUpload',
            rules: [
              {
                required: true, message: '请输入', trigger: 'blur',
              },
            ],
          },
          attrs: {
            uploadUrl: '',
            allowFileTypes: '',
            maxSize: ''
          },
        },
        {
          type: 'MultiInput',
          prop: 'multiInput',
          formItemAttrs: {
            label: 'multiInput',
            rules: [
              {
                required: true, message: '请输入', trigger: 'blur',
              },
            ],
          },
          attrs: {
            style: 'width: 550px'
          },
          select: {
            type: 'Select',
            prop: 'select',
            formItemAttrs: {
              label: 'select',
              rules: [
                {
                  required: true, message: '请输入', trigger: 'blur',
                },
              ],
            },
            attrs: {
              placeholder: '请输入',
              clearable: true,
              style: 'width: 150px'
            },
            listGetter: {
              url: '/basemappings',
              params: { datatype: 'plat' },
              keyMap: { list: 'data' },
              data: [],
              optionValue: 'map_value',
              optionName: 'map_name',
            }
          }
        },
        {
          type: 'Radio',
          prop: 'radio',
          formItemAttrs: {
            label: 'radio',
            rules: [
              {
                required: true, message: '请输入', trigger: 'blur',
              },
            ],
          },
          data: [
            {
              text: '是',
              value: 0,
            },
            {
              text: '否',
              value: 1,
            },
          ],
        },
        {
          type: 'Table',
          prop: 'table',
          formItemAttrs: {
            label: 'table',
            rules: [
              {
                required: true, message: '请输入', trigger: 'blur',
              },
            ],
          },
          attrs: {
            showSelection: true,
          },
          columns: [
            {
              prop: 'map_name', label: 'DSP名称', 'min-width': 120,
            },
            {
              prop: 'map_value', label: '可用流量百分比', 'min-width': 120,
            },
          ],
          listGetter: {
            url: '/basemappings',
            params: { datatype: 'plat' },
            keyMap: { list: 'data' },
            data: [],
            optionValue: 'map_value',
            optionName: 'map_name',
            optionValueUseIndex: true,
          }
        }, {
          type: 'Tag',
          prop: 'tag',
          addName: '添加',
          formItemAttrs: {
            label: 'tag',
            rules: [
              {
                required: true, message: '请输入', trigger: 'blur',
              },
            ],
          },
          attrs: {
            closable: true,
            'disable-transitions': false,
          },
        }
      ],
      buttons: [],
    }
  }
}
</script>
