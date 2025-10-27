<script setup>
import router from '@/router'
import { ref } from 'vue'
import { useUserStore } from '../../stores/user'

const username = ref('')

const userStore = useUserStore()

const { setUser } = userStore

function handleLogin() {
  setUser(username.value)

  router.push('/home')
}
</script>

<template>
  <div class="login d-flex justify-center align-center">
    <v-card min-width="400" class="pa-8" rounded elevation="5">
      <h1>Login</h1>
      <v-text-field label="Label" v-model="username"></v-text-field>
      <v-btn color="success" @click="handleLogin">login</v-btn>
    </v-card>

    <div class="wave-container">
      <div class="wave"></div>
      <!-- <div class="wave-base"></div> -->
    </div>
    <!-- <div class="sky"></div> -->
    <div class="box"></div>
    <div class="box2"></div>
  </div>
</template>

<style scoped>
.login {
  position: relative;
  height: 100%;
  overflow: hidden;
  --cubic-bezier: cubic-bezier(0, 0, 1, 1);
  --wave-animation-time: 2s;
}

.box2 {
  position: absolute;
  left: 300px;
  top: 300px;
  width: 100px;
  height: 100px;
  background-color: blue;
  /* transform: rotate(45deg); */
  animation: testtt 1s ease-in infinite alternate;
}
@keyframes testtt {
  to {
    /* transform: translateX(300px) rotate(360deg); */
    transform: rotate(360deg) translateX(300px);
  }
}
.box {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, transparent 0%, transparent 50%, #212121 50%, #212121 100%);
  background-size: 200% 200%;
  background-position: 10% 10%;
  animation: paintDiagonal 2s var(--cubic-bezier) infinite;
  animation-duration: var(---wave-animation-time);
  background-repeat: no-repeat;
}
@keyframes paintDiagonal {
  60% {
    background-position: 80% 80%;
  }
  75% {
    background-position: 75% 75%;
  }
  100% {
    background-position: 100% 100%;
  }
}

@keyframes slideDiagonal {
  to {
    left: 0;
  }
}

.sky {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #212121;
  bottom: 0;
  right: 0;
  clip-path: polygon(90% 90%, 100% 90%, 100% 100%, 90% 100%);

  animation: sky 3s linear infinite;
  /* animation-delay: var(---wave-animation-time); */
  /* transform: rotate(-45deg); */
}

@keyframes sky {
  from {
    clip-path: polygon(90% 90%, 100% 90%, 100% 100%, 90% 100%);
  }
  to {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
}

.wave-container {
  --wave-width: 5133px;
  width: var(--wave-width);
  position: absolute;
  right: 0;
  /* bottom: -2000px; */
  bottom: 0;
  transform: scale(0.4) rotate(-45deg) translateX(50%);
  transform-origin: bottom right;
  /* animation: test var(---wave-animation-time) var(--cubic-bezier) infinite; */
  /* animation: wave-idle 5s ease-in-out infinite; */
  /* transform: translate(60%, 30%) rotate(-45deg) scale(0.5); */
  /* transform: translate(55%, 50%) rotate(-45deg) scale(0.3); */
}
@keyframes wave-idle {
  50% {
    bottom: 5%;
    right: 5%;
  }
}
@keyframes test {
  60% {
    right: 80%;
    bottom: 80%;
  }
  75% {
    right: 70%;
    bottom: 70%;
  }
  100% {
    right: 100%;
    bottom: 100%;
  }
}
.wave {
  height: 492px;
  background-image: url(../../assets/img/login/wave.svg);
  background-size: contain;
  background-position: left bottom;
  background-repeat: repeat-x;
  animation: wave 5s cubic-bezier(0.32, 2, 0.55, 0.27) infinite;
  /* animation: wave 2s infinite cubic-bezier(0.11, 0.37, 0.91, 0.63); */
  /* animation: wave 50s infinite cubic-bezier(0.5, -10, 0.5, 10); */
  /* animation: wave 5s infinite cubic-bezier(0.47, 1.64, 0.41, 0.8); */
}
@keyframes wave {
  0% {
    background-position-x: 0;
  }
  100% {
    background-position-x: -1711px;
  }
}
.wave-base {
  background-color: #212121;
  height: 2000px;
  transform: translateY(-10px);
}
</style>
