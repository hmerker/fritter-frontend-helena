<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h1 class="">Account information for @{{ $store.state.username }}</h1>
      </header>
      <h2>Community Score</h2>
      <p>
        Each user has a community score, which quantifies the positivity of their freets, shared freets, and comments. A score that is higher than zero indicates overall positive content while a score that is lower than zero implies negativity. If your score is above zero, congratulations on making a positive impact on the Fritter community!
      </p>
      <div
        v-if="communityScore || communityScore === 0"
      >
        {{Number.parseFloat(this.communityScore + 1.25).toFixed(2)}}
      </div>
      <h2>Credibility Count</h2>
      <p>
        Each user also has a credibility count, which keeps track of the number of sources they add to their freets. Fritter aims to decrease misinformation, so thanks if you have added any sources!
      </p>
      <div
        v-if="credibilityCount || credibilityCount === 0"
      >
        {{Number.parseFloat(this.credibilityCount).toFixed(0)}}
      </div>
      <section v-if="followerCounts">
        <h2>Followers and Following Totals</h2>
        <div class="">
          <h3 class="">Number of followers: {{this.followerCounts.followers}}</h3>
          <h3 class="">Number of users following: {{this.followerCounts.following}}</h3>
        </div>
      </section>
    </section>
    <section>
      <header>
        <h2>Account settings</h2>
      </header>
      <ChangeUsernameForm />
      <ChangePasswordForm />
    </section>
    <section>
      <header>
        <h2>Account management</h2>
      </header>
      <DeleteAccountForm />
    </section>
  </main>
</template>

<script>
import ChangeUsernameForm from "@/components/Account/ChangeUsernameForm.vue";
import ChangePasswordForm from "@/components/Account/ChangePasswordForm.vue";
import DeleteAccountForm from "@/components/Account/DeleteAccountForm.vue";
import LogoutForm from "@/components/Account/LogoutForm.vue";

export default {
  name: "AccountPage",
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    DeleteAccountForm,
    LogoutForm,
  },
  data() {
    return {
      communityScore: 0,
      credibilityCount: 0,
      followerCounts: null,
    };
  },
  mounted() {
    fetch(`/api/communityScores`, { method: "GET" }).then(res => res.json()).then((res) => {
      this.communityScore = 0;
      if (res?.score !== null && res?.score !== undefined){
        this.communityScore = res.score;
      }
    });
    fetch(`/api/credibilityCounts`, { method: "GET" }).then(res => res.json()).then((res) => {
      this.credibilityCount = 0;
      if (res?.score !== null && res?.score !== undefined){
        this.credibilityCount = res.score;
      }
    });
    fetch(`/api/followers/followerCounts?userId=${this.$store.state.userId}`, { method: "GET" }).then(res => res.json()).then((res) => {
      this.followerCounts = null;
      if (res !== null && res !== undefined){
        this.followerCounts = res;
      }
    });
  },
};
</script>