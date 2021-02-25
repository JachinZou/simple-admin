<style lang="scss" scoped>
.home__container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-wrap: nowrap;
  overflow: hidden;
  .home__aside {
    flex-shrink: 0;
    width: 200px;
    box-sizing: border-box;
    background: var(--aside-background);
    border-right: solid 1px #eee;
    color: white;
    white-space: nowrap;
    transition: width ease-in .2s;
    overflow: hidden;
    &.small {
      width: 80px;
      overflow: initial;
    }
    &--title {
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &--logo {
      width: 30px;
      margin-right: 10px;
    }
    .home__nav {
      height: calc(100% - 60px);
      box-sizing: border-box;
    }
  }
  .home__content {
    flex-grow: 1;
    &--header {
      height: 60px;
      box-sizing: border-box;
      background: white;
      box-shadow: 0px 2px 2px 0px #eee ;
      position: relative;
    }
    &--main {
      height: calc(100% - 60px);
      overflow-y: auto;
      background: #f9f9f9;
    }
    &--wrap {
      padding: 20px;
    }
  }
}
</style>

<template>
  <div class="home__container">
    <div :class="['home__aside', { small: isCollpase }]">
      <div class="home__aside--title">
        <img
          class="home__aside--logo"
          src="../assets/img/logo.png"
        >
        <span v-if="!isCollpase">
          DEMO 管理
        </span>
      </div>
      <left-navigation
        class="home__nav"
        :menu="menu"
      />
    </div>
    <div class="home__content">
      <div class="home__content--header">
        asdf
      </div>
      <div class="home__content--main">
        <div class="home__content--wrap">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import LeftNavigation from '@/components/left-navigation/index.vue'

import menus, { MenuList } from '@/common/menu'

@Component({
  components: {
    LeftNavigation
  }
})
export default class Home extends Vue {
  isCollpase: boolean = false

  menu: MenuList = menus
}
</script>
