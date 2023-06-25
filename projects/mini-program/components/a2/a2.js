// components/a2.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        type: Number,
        _b: {
            type: Boolean,
            observer() {
                console.log('ssss')
              // 不要这样做！这个 observer 永远不会被触发
            }
          },
    },

    
    /**
     * 组件的初始数据
     */
    data: {
        age: 12
    },

    /**
     * 组件的方法列表
     */
    methods: {
        bindtapHander(){
            console.log(this.properties);
            console.log(this.data)
        }
    }
})
