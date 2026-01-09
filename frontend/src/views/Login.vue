<template>
  <div style="display:flex;justify-content:center;align-items:center;height:100vh;">
    <div>
      <h2>Login</h2>
      <v-text-field
          label="Passwort"
          type="password"
          v-model="password"
      />
      <v-btn color="primary" @click="login">Login</v-btn>
      <p v-if="error" style="color:red">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const password = ref('')
const error = ref('')
const router = useRouter()

function login() {
  if (password.value === 'admin') {
    localStorage.setItem('loggedIn', 'true')
    router.push('/')
  } else {
    error.value = 'Falsches Passwort'
  }
}
</script>