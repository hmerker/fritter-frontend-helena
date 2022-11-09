<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav class="">
    <router-link to="/" class="">
      <div class="left">
        <img src="../../public/logo.svg" />
        <h1 class="title a" style="font-weight: bold; text-decoration: none; padding-left: 15px">
          Fritter
        </h1>
      </div>
    </router-link>
    <div class="right">
      <router-link
        v-if="$store.state.username"
        to="/feed"
        class="a"
      >
        Feed
      </router-link>
      <router-link
        v-if="$store.state.username"
        to="/explore"
        class="a"
      >
        Explore
      </router-link>
      <router-link
        v-if="$store.state.username"
        to="/account"
        class="a"
      >
        @{{ $store.state.username }}
      </router-link>
      <router-link
        v-if="!$store.state.username"
        to="/create"
        class="a"
        style="color: rgb(96,96,96)"
      >
        Create Account
      </router-link>
      <router-link
        v-if="!$store.state.username"
        to="/login"
        class="a"
        style="color: rgb(96,96,96)"
      >
        Sign In
      </router-link>
      <button 
        v-if="$store.state.username" 
        @click="logout"
      >
        Sign Out
      </button>
    </div>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<script>

export default {
  name: "NavBar",
  methods: {
    logout() {
      fetch(`/api/users/session`, { method: "DELETE" }).then(res => res.json()).then(() => {
        this.$store.commit("setUsername", null);
        this.$store.commit("setUserId", null);
        this.$store.commit("alert", {message: "You have successfully signed out of your account.", status: "success"});
        this.$router.push({name: "Home"});
      });
    },
  },
};
</script>

<style scoped>
nav {
    padding: 1vw 2vw;
    background-color: rgb(255, 255, 255);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.title {
    font-size: 32px;
    margin: 0 5px;
}

img {
    height: 32px;
}

.left {
	display: flex;
	align-items: center;
}

.right {
    font-size: 20px;
    display: grid;
    gap: 16px;
    grid-auto-flow: column;
    align-items: center;
}

.right a {
    margin-left: 5px;
}

.alerts {
    width: 25%;
}

a:link {
  text-decoration: none;
}

a:visited {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

a:active {
  text-decoration: underline;
}

</style>
