<template>
  <a :title="title" style="">
    <button v-bind="$attrs" v-on="$listeners"></button>
  </a>
</template>

<script>
export default {
  name:'HintButton',
  props:["title"],
}
</script>

<style>

</style>