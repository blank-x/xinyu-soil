<script setup lang="ts">
import { ref, reactive, toRefs, toRef, isRef, watch } from 'vue'
const count = ref(1)
const obj = reactive({})
const obj1 = reactive(count)
// 装包
const obj2 = ref(obj)
console.log(obj2.value)
// console.log(obj);
// console.log(count.value);
// 会拆包
obj.count = count
window.count = count
window.obj = obj
console.log(obj2) // 1
console.log(obj.count === count.value) // true
</script>

<template>
  <main>assas</main>
</template>
