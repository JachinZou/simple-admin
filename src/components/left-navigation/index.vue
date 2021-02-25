<style lang="scss" scoped>
.navigation__container {
  // padding: 10px 0;
  overflow: hidden scroll;
  width: calc(100% + 17px);
  .navigation__item {
    white-space: nowrap;
  }
}
</style>

<template>
  <div class="navigation__container">
    <navigation-item
      v-for="item in menu"
      :key="item.route"
      class="navigation__item"
      :menu="item"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, ProvideReactive } from 'vue-property-decorator'
import { MenuList } from '@/common/menu'

import { Route } from 'vue-router'

import NavigationItem from './item.vue'

@Component({
  components: {
    NavigationItem
  }
})
export default class LeftNavigation extends Vue {
  @Prop({
    type: Array,
    default: () => []
  })
  private menu!: MenuList;

  @ProvideReactive() route: Route = this.$route

  @Watch('$route')
  handleRouteChange (route: Route) {
    this.route = route
  }
}
</script>
