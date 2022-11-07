<template>
  <div id="app">
    <header>
      <NavBar />
    </header>
    <router-view />
  </div>
</template>

<script lang="ts">
import NavBar from '@/components/common/NavBar.vue';

async function get_helper(url: string, params = {}) {
  const result = await fetch(url, { ...params, method: "GET" });
  return await (result.ok ? result.json() : null);
}

export default {
  name: 'App',
  components: {NavBar},
  beforeCreate() {
    // Sync stored username to current session
    get_helper('/api/users/session', {
      credentials: 'same-origin', // Sends express-session credentials with request
    }).then((result) => {
      this.$store.commit('setUsername', result ? result.user.username : null);
      this.$store.commit('setUserId', result ? result.user._id : null);
    });

    // Clear alerts on page refresh
    this.$store.state.alerts = {};
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}
body {
  height: 100vh;
  flex-direction: column;
  display: flex;
  padding: 0;
  margin: 0;
  font-size: 1.2em;
}

main {
  padding: 0 5em 5em;
}

.alerts {
  position: absolute;
  z-index: 99;
  bottom: 0;
  top: 100%;
  left: 50%;
  transform: translate(-50%, 10%);
  width: 100%;
  text-align: center;
}

.alerts article {
  border-radius: 5px;
  padding: 10px 20px;
  color: #fff;
}

.alerts p {
  margin: 0;
}

.alerts .error {
  background-color: rgb(166, 23, 33);
}

.alerts .success {
  background-color: rgb(45, 135, 87);
}
</style>
