<template>
    <div :style="{width:width}" class="el-pr">
        <el-input :maxlength="maxSize" type="textarea" :autosize="{ minRows:minRows, maxRows: 8}" :placeholder="placeholder"
                  v-model="currentValue" @input="handleModelInput">
        </el-input>
        <p class="word-counter"><span style="color:#b3b5b0">{{contentShortLength}}/{{maxSize}}</span></p>
    </div>
</template>
<script type="text/ecmascript-6">
    export default {
        name: "textareaSize",
        data() {
            return {
                currentValue: this.value
            }
        },
        methods: {
            handleModelInput(val) {
                const value = val
                this.$emit('input', value)
                if (this.$parent.$options.componentName === 'ElFormItem') {
                    if (this.validateEvent) {
                        this.$parent.$emit('el.form.change', [value])
                    }
                }
                this.$emit('change', value)
            }
        },
        computed: {
            contentShortLength() {
                if (this.currentValue) {
                    return this.currentValue.length
                } else {
                    return 0
                }
            }
        },
        watch: {
            'value': function (newValue) {
                if (newValue && newValue.length > this.maxSize) {
                    this.$nextTick( ()=> {
                        this.currentValue = newValue.substring(0, this.maxSize);
                    })
                } else {
                    this.currentValue = newValue
                }
            }
        },
        props: {
            'maxSize': {
                type: Number
            },
            value: [String, Number],
            'width': {
                type: String,
                default: '85%'
            },
            'minRows': {
                type: Number,
                default: 3
            },
            placeholder: {
                type: String,
                default: '请输入内容'
            }
        }
    }
</script>
<style scoped lang="scss">

    .word-counter {
        position: absolute;
        right: 10px;
        font-size: 12px;
        bottom: -5px;
        margin:0px;
        span {
            color: #FA5555
        }
    }
</style>