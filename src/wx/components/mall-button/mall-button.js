// components/component-tag-name.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mallName: {//按钮文本
      type: String,
      value: '',
      observer: (newVal, oldVal) => {}
    },
    mallType: {//按钮类型
      type: String,
      value: '',
      observer: (newVal, oldVal) => { }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap: function() {
      this.triggerEvent('customevent', {}) 
    }
  }
})
