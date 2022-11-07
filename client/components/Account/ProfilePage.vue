<template>
  <main>
    <section>
      <header v-if="user">
        <h1> Profile Page for @{{ this.user.username }}</h1>
      </header>
      <h2 class="" v-if="user === null">
        User does not exist with username '{{ this.$route.query.username }}'.
      </h2>
      <section v-if="followerCounts">
        <div class="">
          <h3 class="">Number of followers: {{this.followerCounts.followers}}</h3>
          <h3 class="">Number of users following: {{this.followerCounts.following}}</h3>
        </div>
        <button v-if="alreadyFollowing !== undefined" @click="followCallback">
          {{ !this.alreadyFollowing ? "Follow" : "Unfollow" }}
        </button>
      </section>
      <hr v-if="user" />
      <h2 v-if="user">Freets with @{{ user.username }} as an author.</h2>
      <section v-if="freets">
        <FreetComponent
          v-for="freet in freets"
          :key="freet.id"
          :freet="freet"
        />
      </section>
    </section>
  </main>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";

async function get_helper(url, params = {}) {
  const result = await fetch(url, { ...params, method: "GET" });
  return await (result.ok ? result.json() : null);
}

async function delete_helper(url, params = {}) {
  const result = await fetch(url, { ...params, method: "DELETE" });
  return await (result.ok ? result.json() : null);
}

async function post_helper(url, params = {}) {
  const result = await fetch(url, {...params, method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin"});
  return await (result.ok ? result.json() : null);
}

export default {
  name: "ProfilePage",
  components: {
    FreetComponent,
  },
  mounted() {
    const {username} = this.$route.query;
    
    if (username === this.$store.state.username) {
      this.$router.push("/account");
      return;
    }
    
    get_helper(`/api/users?username=${username}`).then((result) => {
      if (result) {
        this.user = result.user;
        
        get_helper(`/api/freets?author=${username}`).then((result) => {
          this.freets = result;
        });
        get_helper(`/api/followers/followerCounts?userId=${result.user._id}`).then((result) => {
          this.followerCounts = result;
        });
        get_helper(`/api/followers/following?userId=${result.user._id}`).then((result) => {
          if (result) {
            this.alreadyFollowing = result.following;
          }
        });
      } 
      else {
        this.user = null;
      }
    });
  },
  methods: {
    followCallback() {
      if (this.alreadyFollowing) {
        delete_helper(`/api/followers/${this.user._id}`).then((result) => {
          if (result) {
            this.alreadyFollowing = false;
            this.followerCounts.followers = this.followerCounts.followers - 1;
          } 
          else {
            this.$store.commit("alert", {message: "When attempting to unfollow this user, an error occurred.", status: "error"});
          }
        });
      } 
      else {
        post_helper(`/api/followers/`, {body: JSON.stringify({userFollowed: this.user._id })}).then((result) => {
          if (result) {
            this.alreadyFollowing = true;
            this.followerCounts.followers = this.followerCounts.followers + 1;
          } 
          else {
            this.$store.commit("alert", {message: "When attempting to follow this user, an error occurred.", status: "error",});
          }
        });
      }
    },
  },
  data() {
    return {
      user: undefined,
      freets: undefined,
      alreadyFollowing: undefined,
      followerCounts: undefined,
    };
  },
};
</script>