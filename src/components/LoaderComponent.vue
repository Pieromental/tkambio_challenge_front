<template>
  <teleport to="body">
    <div v-if="!isLoaderRemoved" :class="['loader-screen', { 'fade-out': isFadingOut }]">
      <div class="loader-content">
        <span class="loader-text">Cargando...</span>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { useLoader } from '@/composable/loader/useLoader' // Importar el composable

const { isLoading } = useLoader()

const isLoaderRemoved = ref(true) // Controla si está en el DOM
const isFadingOut = ref(false)

watch(isLoading, (newVal) => {
  if (newVal) {
    isLoaderRemoved.value = false
    isFadingOut.value = false
  } else {
    isFadingOut.value = true
    setTimeout(() => {
      isLoaderRemoved.value = true
    }, 1200)
  }
})
</script>

<style lang="sass" scoped>
.loader-screen
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 9999
  display: flex
  justify-content: center
  align-items: center
  background: rgb(255,201,94)
  background: linear-gradient(137deg, rgba(255,201,94,0.74) 0%, rgba(255,174,14,0.57) 98%)
  opacity: 1
  animation: fadeIn 0.5s ease-in-out forwards

  &.fade-out
    animation: fadeOut 0.5s ease-in-out forwards

.loader-content
  display: flex
  flex-direction: column
  align-items: center
  color: white
  font-size: 1.5rem
  font-weight: bold

@keyframes fadeIn
  from
    opacity: 0
  to
    opacity: 1

@keyframes fadeOut
  from
    opacity: 1
  to
    opacity: 0
</style>
