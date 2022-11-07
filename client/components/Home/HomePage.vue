<!-- Home page -->

<template>
  <main>
    <section>
      <header>
        <h1 class="header w3-main w3-content" style="font-weight: bold; margin-top: 100px">Welcome to Fritter!</h1>
      </header>
      <div class="w3-main w3-content" style="max-width:1600px;margin-top:55px">
        <h3 v-if="!$store.state.username">
          <router-link to="/login">
            <button>Sign In</button>
          </router-link>  
          <router-link to="/create">
            <button>Create Account</button>
          </router-link>
          <img src="../../public/feather.svg" width="32px" height="32px"/>
        </h3>
      </div>
    </section>
    <section>
      <h3 class="w3-main w3-content" style = "text-align: center; margin-top: 50px; margin-bottom: 50px">
        Fritter provides a platform where anyone can create any type of content that resonates with them. Start drafting and publishing your thoughts and ideas now!
      </h3>
    </section>
    <section style ='background-color: white; padding: 30px; border-radius: 8px;'>
      <header>
        <div class="left">
          <h2>
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <div class="right">
          <GetFreetsForm
            ref="getFreetsForm"
            value="author"
            placeholder="🔍 Filter by author (optional)"
            button="🔄 Get freets"
          />
        </div>
      </header>
      <section
        v-if="$store.state.freets.length"
      >
        <FreetComponent
          v-for="freet in $store.state.freets"
          :key="freet.id"
          :freet="freet"
        />
      </section>
      <article
        v-else
      >
        <h3>No freets found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';

export default {
  name: "HomePage",
  components: {FreetComponent, GetFreetsForm, CreateFreetForm},
  mounted() {
    this.$refs.getFreetsForm.submit();
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}
header, header > * {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
button {
  margin-right: 10px;
}
section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>