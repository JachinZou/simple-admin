<style scoped lang="scss">
</style>

<template>
  <div class="login__form">
    <label for="username">
      用户名:
      <input id="username" v-model="username" type="text">
    </label>
    <br>
    <br>
    <label for="password">
      密码:
      <input id="password" v-model="password" type="password">
    </label>
    <br>
    <br>
    <button @click="handleLogin">
      登陆
    </button>
  </div>
</template>

<script lang="ts">
import { isLogin, login } from '@/common/authority'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Login extends Vue {
  @Prop()
  private msg!: string;

  username: string = ''
  password: string = ''

  mounted () {
    if (isLogin()) {
      this.$router.replace({
        name: 'home'
      })
    }
  }

  handleLogin () {
    login({
      username: this.username,
      password: this.password
    }).then(() => {
      this.$router.replace({
        name: 'home'
      })
    })
  }
}
</script>
