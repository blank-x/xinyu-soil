import Vue from 'vue';
//权限指令
const  has = Vue.directive('has', {
    bind: function(el, binding) {
        if (!Vue.prototype.$_has(binding.value)) {
            Vue.nextTick(function () {
            // if(el.nextElementSibling && el.nextElementSibling.className && el.nextElementSibling.className.indexOf('ver-line')>-1){
            //     el.parentNode.removeChild(el.nextElementSibling)
            // }else if(el.previousElementSibling && el.previousElementSibling.className && el.previousElementSibling.className.indexOf('ver-line')>-1){
            //     el.parentNode.removeChild(el.previousElementSibling)
            // }
            // el.parentNode.removeChild(el);
                el.className = el.className+' is-disabled'
                el.disabled = true
            })
        }
    }
});
export {has}
