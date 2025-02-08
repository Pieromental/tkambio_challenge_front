<template>
  <div class="layout-container">
    <div class="header">
      <img class="logo-img" src="@/assets/image/bg-tkambio-v2.png" alt="logo tkambio" />
      <button @click="logout">
        <img :src="logOut" alt="Icono" class="button-icon" />
      </button>
    </div>
    <div class="router-view">
      <RouterView />
    </div>
  </div>
</template>
<script lang="ts" setup>
/****************************************************************************/
/*                               IMPORTS                                     */
/****************************************************************************/
import { useRouter } from 'vue-router'
import { useAlert } from '@/composable/alert/useAlert'
import logOut from '@/assets/icons/log_out.png'
/****************************************************************************/
/*                               COMPOSABLE                                  */
/****************************************************************************/
const router = useRouter()
const { showAlert } = useAlert()
/****************************************************************************/
/*                               METHODS                                    */
/****************************************************************************/
const logout = async () => {
  const confirm = await showAlert({
    type: 'warning',
    mode: 'confirm',
    title: '',
    message: '¿Está seguro de querer cerrar sesión?.',
  })
  if (confirm) {
    localStorage.clear()
    sessionStorage.clear()
    router.push({ name: 'login' })
  }
}
</script>
<style lang="sass" scoped>
@import '@/assets/styles/main.sass'
.header
    height: 12vh
    background: linear-gradient(to bottom, rgb(7,168,240), rgb(69,99,230))
    display: flex
    align-items: center
    justify-content: center
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3)
    position: relative
    @include responsive("lg", "max")
        padding-left: 20px
        justify-content: left

button
  position: absolute  /* Usa posición absoluta para colocar el botón a la derecha */
  right: 20px  /* Ajusta la distancia del borde derecho */
  background: none
  border: none
  height: 60%
  cursor: pointer
  border-radius: 5px
  transition:  box-shadow 0.3s
  display: inline-block
  &:hover
     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1)

.logo-img
  height: 60%

.button-icon
  height: 80%

.router-view
    height: 88vh
</style>
