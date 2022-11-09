<template>
  <main>
    <section>
      <header v-if="user">
        <h1> Profile Page: <b>@{{ this.user.username }}</b></h1>
      </header>
      <h2 class="" v-if="user === null">
        User does not exist with username '{{ this.$route.query.username }}'.
      </h2>
      <section style = "margin-top: 30px; margin-bottom: 30px; background-color: white; padding: 30px; border-radius: 8px;" v-if="followerCounts">
        <div class="">
          <h3 class=""><b>Number of followers: &nbsp;</b> {{this.followerCounts.followers}}</h3>
          <h3 class=""><b>Number of users following: &nbsp;</b> {{this.followerCounts.following}}</h3>
        </div>
        <div style="padding-top: 20px">
        <button v-if="alreadyFollowing !== undefined" @click="followCallback">
          {{ !this.alreadyFollowing ? "Follow" : "Unfollow" }}
        </button>
        </div>
      </section>
      <div style = "margin-top: 30px; margin-bottom: 30px; background-color: white; padding: 30px; border-radius: 8px;">
      <h2 v-if="user">Freets with @{{ user.username }} as the author.</h2>
      <section v-if="freets">
        <FreetComponent
          v-for="freet in freets"
          :key="freet.id"
          :freet="freet"
        />
      </section>
      </div>
      <div style = "margin-top: 30px; margin-bottom: 30px; background-color: white; padding: 30px; border-radius: 8px;">
      <h2 v-if="user">Shared Freets with @{{ user.username }} as an author.</h2>
      <section v-if="sharedFreets">
        <SharedFreetComponent
          v-for="sharedFreet in sharedFreets"
          :key="sharedFreet.id"
          :sharedFreet="sharedFreet"
        />
      </section>
      </div>
    </section>
  </main>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";
import SharedFreetComponent from "@/components/SharedFreet/SharedFreetComponent.vue";

export default {
  name: "ProfilePage",
  components: {
    FreetComponent,
    SharedFreetComponent,
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

        fetch(`/api/sharedFreets?author=${username}`, { method: "GET" }).then(res => res.json()).then((res) => {
          this.sharedFreets = res;
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
      sharedFreets: undefined,
      alreadyFollowing: undefined,
      followerCounts: undefined,
    };
  },
};
</script>