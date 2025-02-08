<template>
  <div class="log-container">
    <h1 class="log-container-title">Inicia Sesión</h1>
    <form @submit.prevent="login">
      <div class="log-container-group" :class="{ error: form.errors.email }">
        <label for="email" class="log-container-label"> Correo</label>
        <input
          type="text"
          v-model="form.email"
          class="log-container-input"
          @blur="validateField('email')"
        />
        <span v-if="form.errors.email" class="log-container-error">{{ form.errors.email }}</span>
      </div>
      <div class="log-container-group password-group" :class="{ error: form.errors.password }">
        <label for="password" class="log-container-label">Contraseña</label>
        <div class="password-container">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="form.password"
            class="log-container-input"
            @blur="validateField('password')"
          />
          <button type="button" class="eye-button" @click="togglePassword">
            <img :src="showPassword ? eyeClosed : eyeOpen" alt="Toggle Password" />
          </button>
        </div>

        <span v-if="form.errors.password" class="log-container-error">{{
          form.errors.password
        }}</span>
      </div>
      <div class="log-container-remenber-me">
        <input
          type="checkbox"
          class="log-container-remenber-me-check-box"
          v-model="form.rememberMe"
        />
        <label class="log-container-remenber-me-label">Recordar Sesión</label>
      </div>
      <div class="log-container-log-button">
        <button>Iniciar Sesión</button>
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
/****************************************************************************/
/*                             IMPORTS                                      */
/****************************************************************************/
import { ref, reactive, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { resources } from '../api/AuthResource'
import { useFetchHttp } from '@/composable/fetch/useFetchHttp'
import { useCrypto } from '@/composable/crypto/useCrypto'
import { useLoader } from '@/composable/loader/useLoader'
import { useAlert } from '@/composable/alert/useAlert'
import eyeOpen from '@/assets/icons/eye-close-up.png'
import eyeClosed from '@/assets/icons/closed-eyes.png'

/****************************************************************************/
/*                             COMPOSABLE                                    */
/****************************************************************************/
const { fetchHttpResource } = useFetchHttp()
const { encryptAES, decryptAES } = useCrypto()
const { showLoader, hideLoader } = useLoader()
const { showAlert } = useAlert()
const router = useRouter()

/****************************************************************************/
/*                             DATA                                         */
/****************************************************************************/
const form = reactive({
  email: '',
  password: '',
  rememberMe: false,
  errors: { email: '', password: '' },
})

const showPassword = ref(false)
/****************************************************************************/
/*                             WATCHERS                                      */
/****************************************************************************/
watchEffect(() => {
  if (form.email) form.errors.email = ''
  if (form.password) form.errors.password = ''
})
/****************************************************************************/
/*                             METHODS                                       */
/****************************************************************************/
const togglePassword = () => {
  showPassword.value = !showPassword.value
}
const validateField = (field: 'email' | 'password') => {
  form.errors[field] = !form[field]
    ? field === 'email'
      ? 'El correo es obligatorio'
      : 'La contraseña es obligatoria'
    : ''
}

const login = async () => {
  try {
    validateField('email')
    validateField('password')
    if (!form.errors.email && !form.errors.password) {
      resources.login.data = {
        email: form.email.trim(),
        password: form.password.trim(),
      }
      showLoader()
      const response: any = await fetchHttpResource(resources.login, true)
      hideLoader()

      if (response.status) {
        const data = response.data
        const tokenString: string = data.token ? String(data.token) : ''

        if (form.rememberMe) {
          localStorage.setItem(import.meta.env.VITE_NAME_TOKEN, encryptAES(tokenString) ?? '')
        } else {
          sessionStorage.setItem(import.meta.env.VITE_NAME_TOKEN, encryptAES(tokenString) ?? '')
        }
        router.push({ name: 'main' })
      } else {
        await showAlert({
          type: 'error',
          title: response.title,
          message: response.message,
        })
      }
      console.log('Formulario enviado con:', { email: form.email, password: form.password })
    }
  } catch (error) {
    console.log(error)
  }
}

const verificarLogin = async () => {
  const encryptedToken =
    localStorage.getItem(import.meta.env.VITE_NAME_TOKEN) ||
    sessionStorage.getItem(import.meta.env.VITE_NAME_TOKEN)
  if (encryptedToken) {
    const token = decryptAES(encryptedToken)
    if (token) {
      router.push({ name: 'main' })
    }
  }
}
/****************************************************************************/
/*                             LYFECICLE                                     */
/****************************************************************************/
onMounted(() => {
  verificarLogin()
})
</script>

<style lang="sass">
.log-container
  display: flex
  align-items: center
  justify-content: center
  min-height: 100%
  flex-direction: column

  &-title
    width: 100%
    font-size: 1.5rem
    font-weight: 600
    margin-bottom: 1rem
    text-align: center
  form
    min-width: 80%
  &-group
    display: flex
    flex-direction: column
    margin-bottom: 2rem
    position: relative

    &.error
      .log-container-input
        border-color: #e3342f !important
        background-color: #fff5f5

      .log-container-error
        color: #e3342f
        font-size: 0.85rem
        position: absolute
        bottom: -20px
  &-label
    color: #4b5563
    margin-bottom: 0.5rem

  &-input
    min-width: 100%
    height: 30px
    border: 1px solid #d1d5db
    border-radius: 0.375rem
    padding: 0.5rem 0.75rem
    outline: none
    &:focus
      border-color: #3b82f6
  &-remenber-me
    margin-top: 1.5rem
    margin-bottom: 1.5rem

    &-check-box
      transform: scale(1.5)
      accent-color: #0FBCF4
    &-label
      margin-left:1rem
  &-log-button
    width:  100%
    display: flex
    justify-content: center
    align-items: center
    button
      min-width: 40%
      background-color: #FFAE0E
      color: black
      font-size: 1.1rem
      border-radius: 2rem
      height: 50px
      font-weight: bold
      border: none
      cursor: pointer
      transition: background 0.3s ease
      &:hover
        background-color: darken(#FFAE0E, 10%)

.password-container
  position: relative
  display: flex
  align-items: center

.eye-button
  position: absolute
  right: 5px
  background: none
  border: none
  cursor: pointer
  padding: 0
  img
    width: 25px
    height: 25px
    opacity: 0.7
    transition: opacity 0.3s eas
    &:hover
      opacity: 1
</style>
