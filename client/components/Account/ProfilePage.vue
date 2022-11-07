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
    
    fetch(`/api/users?username=${username}`, { method: "GET" }).then(res => res.json()).then((res) => {
      if (res) {
        this.user = res.user;
        
        fetch(`/api/freets?author=${username}`, { method: "GET" }).then(res => res.json()).then((res) => {
          this.freets = res;
        });

        fetch(`/api/followers/followerCounts?userId=${res.user._id}`, { method: "GET" }).then(res => res.json()).then((res) => {
          this.followerCounts = res;
        });

        fetch(`/api/followers/following?userId=${res.user._id}`, { method: "GET" }).then(res => res.json()).then((res) => {
          if (res) {
            this.alreadyFollowing = res.following;
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
        fetch(`/api/followers/${this.user._id}`, { method: "DELETE" }).then(res => res.json()).then((res) => {
          if (res) {
            this.alreadyFollowing = false;
            this.followerCounts.followers = this.followerCounts.followers - 1;
          } 
          else {
            this.$store.commit("alert", {message: "When attempting to unfollow this user, an error occurred.", status: "error"});
          }
        });
      } 
      else {
        const options = {body: JSON.stringify({userFollowed: this.user._id })};
        fetch(`/api/followers/`, {...options, method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin" }).then(res => res.json()).then((res) => {
          if (res) {
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