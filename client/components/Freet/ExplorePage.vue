<template>
  <main>
    <section>
      <header>
        <h1>Explore</h1>
      </header>
    </section>
    <section style ='background-color: white; padding: 30px; border-radius: 8px;'>
      <header>
        <div class="left">
          <h2>Explore content and find new users to follow! </h2>
        </div>
      </header>
      <section v-if="$store.state.freetsForExplore.length">
        <FreetComponent
          v-for="freet in $store.state.freetsForExplore"
          :key="freet.id"
          :freet="freet"
        />
      </section>
      <article v-else>
        <h3>
          No freets found. 
        </h3>
        <h3>
          Check out your
          <router-link to="/">
            <button> Feed </button>
          </router-link>
        </h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';

export default {
  name: 'ExplorePage',
  components: { 
    FreetComponent, 
    GetFreetsForm, 
    CreateFreetForm 
  },
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