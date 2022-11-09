<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h1 class="">Account Information: <b>@{{ $store.state.username }}</b></h1>
      </header>
      <div style = "margin-top: 30px; margin-bottom: 30px; background-color: white; padding: 30px; border-radius: 8px;">
      <h2>Community Score</h2>
      <p>
        Each user has a community score, which quantifies the positivity of their freets. A score that is higher than zero indicates overall positive content while a score that is lower than zero implies negativity. If your score is above zero, congratulations on making a positive impact on the Fritter community!
      </p>
      <div
        v-if="communityScore || communityScore === 0"
      >
        <h4>Score: &nbsp;{{Number.parseFloat(this.communityScore).toFixed(2)}}</h4>
      </div>
      </div>
      <div style = "margin-top: 30px; margin-bottom: 30px; background-color: white; padding: 30px; border-radius: 8px;">
      <h2>Credibility Count</h2>
      <p>
        Each user also has a credibility count, which keeps track of the number of sources that they have added to their freets. Fritter aims to decrease misinformation, so thanks for adding sources!
      </p>
      <div
        v-if="credibilityCount || credibilityCount === 0"
      >
        <h4>Count: &nbsp;{{Number.parseFloat(this.credibilityCount).toFixed(0)}}</h4>
      </div>
      </div>
      <div style = "margin-top: 30px; margin-bottom: 30px; background-color: white; padding: 30px; border-radius: 8px;">
      <section v-if="followerCounts">
        <h2>Followers and Following Totals</h2>
        <div style="padding-top: 3px;">
          <h4 class="">Number of followers: &nbsp; {{this.followerCounts.followers}}</h4>
          <h4 class="">Number of users following: &nbsp; {{this.followerCounts.following}}</h4>
        </div>
      </section>
      </div>
    </section>
    <section>
      <header>
        <h2>Account Settings</h2>
      </header>
      <ChangeUsernameForm />
      <ChangePasswordForm />
    </section>
    <section style="margin-top: 30px">
      <header>
        <h2>Account Management</h2>
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