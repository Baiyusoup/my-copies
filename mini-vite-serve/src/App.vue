<template>
  <header>
    <h1>Hello World My Server</h1>
  </header>
  <main>
    <button @click="add">递增</button>
    <span>count：{{count}}</span>
    <span>double: {{double}}</span>  
  </main>
</template>

<script>
import {ref,computed} from 'vue';
export default {
  setup(){
    const count = ref(6)
    function add(){
      count.value++
    }
    const double = computed(()=>count.value*2)
    return {count,add,double}
  }
}
</script>