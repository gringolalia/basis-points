<template lang="pug">
#app
  ._c-hero._c-hero--full(style='background-color: #607d8b; color: #fff;')
    ._c-hero__content._u-text-center.with.dignity(style='font-size: 50px; padding: 5rem;') Technology is a good servant but a bad master
  ._c-container
      a._c-btn._c-btn--ghost(role='button') Basis of Stasis
  ._c-container
    img(alt='Vue logo' src='./assets/img/alchemy-sulphuric.svg' height="200px")
    h1(style="margin-top: 50px") Addio Mondo Crudele
    HelloWorld
    
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  }
}
</script>
<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 60px
</style>
