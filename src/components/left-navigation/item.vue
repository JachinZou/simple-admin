<style lang="scss" scoped>
.navigation__item--text {
  position: relative;
  padding: 10px 24px;
  cursor: default;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:not(.is-active):hover {
    background: #FFFFFF11;
  }
  &.is-active {
    background: var(--primary);
  }
  .navigation__item--dot {
    display: inline-block;
    width: 4px;
    height: 4px;
    background: white;
    border-radius: 2px;
    margin-right: 8px;
  }
  >.text {
    width: 0;
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    user-select: none;
  }
  .icon {
    flex-shrink: 0;
    width: 8px;
    height: 8px;
    box-sizing: border-box;
    border-right: solid 1px white;
    border-bottom: solid 1px white;
    transform: rotate(-45deg);
    transition: transform .2s ease-in-out;
    &.collapse {
      transform: rotate(45deg);
    }
  }
}
.navigation__children {
  background: #FFFFFF0f;
  overflow: hidden;
  &.transition {
    transition: max-height .3s ease-in-out;
  }
}
</style>

<template>
  <div>
    <div :class="['navigation__item--text', { 'is-active': isActive }]" @click="handleClick">
      <span v-if="depth > 0" class="navigation__item--dot" :style="{ marginLeft: (depth - 1) * 12 + 'px' }" />
      <span class="text">{{ menu.name }}</span>
      <div v-if="hasChildren" :class="['icon', isCollapse && 'collapse']" />
    </div>
    <div
      v-if="hasChildren"
      ref="childrenBox"
      :class="['navigation__children', transition && 'transition']"
      :style="{ maxHeight: maxHeight + 'px' }"
    >
      <navigation-item
        v-for="item in children"
        :key="item.route"
        :menu="item"
        :depth="depth + 1"
        :parent-collapse="triggerCollapse"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, InjectReactive, Watch } from 'vue-property-decorator'
import { Menu } from '@/common/menu'
import { equal } from '@/utils/utils'

import { Route } from 'vue-router'

@Component
export default class NavigationItem extends Vue {
  @Prop({
    type: Object,
    default: () => ({})
  })
  private menu!: Menu

  @Prop({
    type: Number,
    default: 0
  })
  private depth!: number

  @Prop({
    type: Function
  })
  private parentCollapse!: (status?: boolean) => void

  isCollapse: boolean = false
  maxHeight: number = 0
  transition: boolean = false

  @InjectReactive() route!: Route

  get hasChildren (): boolean {
    if ('children' in this.menu) {
      return !!this.menu.children.length
    } else {
      return false
    }
  }

  get children (): Array<Menu> {
    if ('children' in this.menu) {
      return this.menu.children
    } else {
      return []
    }
  }

  get isActive (): boolean {
    const isLeaf = !this.hasChildren
    if (!isLeaf) return false
    const routeName = this.route.meta.belongTo || this.route.name
    return this.menu.route === routeName
  }

  @Watch('isActive', { immediate: true })
  handleActiveChange (val: boolean): void {
    if (val && this.parentCollapse) {
      this.$nextTick(() => {
        this.parentCollapse(true)
      })
    }
  }

  mounted (): void {
    const dom = this.$refs.childrenBox
    if (dom instanceof Element) {
      dom.addEventListener('transitionend', this.transitionend)
    }
  }

  beforeDestroy (): void {
    const dom = this.$refs.childrenBox
    if (dom instanceof Element) {
      dom.removeEventListener('transitionend', this.transitionend)
    }
  }

  handleClick (): void {
    if (this.hasChildren) {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        this.transition = true
        this.maxHeight = this.getChildrenHeight()
      } else {
        this.transition = false
        this.$nextTick(() => {
          this.maxHeight = this.getChildrenHeight()
          setTimeout(() => {
            this.transition = true
            this.maxHeight = 0
          }, 0)
        })
      }
    } else {
      let params = {}
      if (this.menu.getParams) {
        params = this.menu.getParams(this)
      }
      const paramsEqual: boolean = equal(params, this.$route.params)
      const routeEqual: boolean = equal(this.menu.route, this.$route.name)
      if (paramsEqual && routeEqual) return
      this.$router.push({
        name: this.menu.route,
        params
      })
    }
  }

  transitionend (): void {
    if (this.isCollapse) {
      this.transition = false
      this.$nextTick(() => {
        this.maxHeight = 99999
      })
    }
  }

  getChildrenHeight (): number {
    const dom = this.$refs.childrenBox
    let height = 0
    if (dom instanceof Element) {
      height = dom.scrollHeight
    }
    return height
  }

  triggerCollapse (status?: boolean): void {
    if (typeof status === 'undefined') {
      this.handleClick()
    } else {
      if (status !== this.isCollapse) {
        this.handleClick()
      }
    }
    if (status === true && this.parentCollapse) {
      this.parentCollapse(status)
    }
  }
}
</script>
