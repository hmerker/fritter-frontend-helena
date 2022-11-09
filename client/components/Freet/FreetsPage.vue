<!-- Default page that also displays freets -->

<template>
  <main>
    <section v-if="$store.state.username">
      <header>
        <h1>Welcome @{{ $store.state.username }} to your feed!</h1>
      </header>
      <CreateFreetForm />
      <CreateSharedFreetForm />
    </section>
    <section style ='background-color: white; padding: 30px; border-radius: 8px; margin-top: 15px;' v-if="$store.state.username">
      <header>
        <div class="left">
          <h2>
            Viewing all freets
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
            <span v-else>
              by you and the Fritter users you follow.
            </span>
          </h2>
        </div>
        <div class="right">
          <GetFreetsForm
            ref="getFreetsForm"
            value="author"
            placeholder=" 🔍 Filter by author (optional)"
            button="🔄 Get freets"
          />
        </div>
      </header>
      <section 
        v-if="$store.state.freetsForFeed.length"
      >
        <FreetComponent
          v-for="freet in $store.state.freetsForFeed"
          :key="freet.id"
          :freet="freet"
        />
      </section>
      <article v-else>
        <h3>
          There are no freets found to populate your feed. 
        </h3>
        <h3>
          <router-link to="/explore"> 
            <button>Explore</button>
          </router-link>
          to discover new freets!
        </h3>
      </article>
    </section>
    <section style ='background-color: white; padding: 30px; border-radius: 8px; margin-top: 30px;' v-if="$store.state.username">
      <header>
        <div class="left">
          <h2>
            Viewing all shared freets
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
            <span v-else>
              by you and the Fritter users you follow.
            </span>
          </h2>
        </div>
        <div class="right">
          <GetSharedFreetsForm
            ref="getSharedFreetsForm"
            value="author"
            placeholder=" 🔍 Filter by author (optional)"
            button="🔄 Get shared freets"
          />
        </div>
      </header>
      <section 
        v-if="$store.state.sharedFreetsForFeed.length"
      >
        <SharedFreetComponent
          v-for="sharedFreet in $store.state.sharedFreetsForFeed"
          :key="sharedFreet.id"
          :sharedFreet="sharedFreet"
        />
      </section>
      <article v-else>
        <h3>
          There are no shared freets found to populate your feed. 
        </h3>
        <h3>
          <router-link to="/explore"> 
            <button>Explore</button>
          </router-link>
          to discover new shared freets!
        </h3>
      </article>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';
import SharedFreetComponent from '@/components/SharedFreet/SharedFreetComponent.vue';
import CreateSharedFreetForm from '@/components/SharedFreet/CreateSharedFreetForm.vue';
import GetSharedFreetsForm from '@/components/SharedFreet/GetSharedFreetsForm.vue';

export default {
  name: 'FreetPage',
  components: {FreetComponent, GetFreetsForm, CreateFreetForm, SharedFreetComponent, GetSharedFreetsForm, CreateSharedFreetForm},
  mounted() {
    this.$refs.getFreetsForm.submit();
    this.$refs.getSharedFreetsForm.submit();
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