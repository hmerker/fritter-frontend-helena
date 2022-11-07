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
        v-if="communityScore"
      >
        {{Number.parseFloat(this.communityScore).toFixed(1)}}
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

async function get_helper(url, params = {}) {
  const result = await fetch(url, { ...params, method: "GET" });
  return await (result.ok ? result.json() : null);
}

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
      followerCounts: null,
    };
  },
  mounted() {
    get_helper(`/api/communityScores`).then((result) => {
      this.communityScore = 0;
      if (result?.score !== null && result?.score !== undefined){
        this.communityScore = result.score;
      }
    });
    get_helper(`/api/followers/followerCounts?userId=${this.$store.state.userId}`).then((result) => {
      this.followerCounts = null;
      if (result !== null && result !== undefined){
        this.followerCounts = result;
      }
    });
  },
};
</script>