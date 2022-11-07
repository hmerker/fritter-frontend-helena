<template>
  <article class="">
    <span>
      <router-link class="" :to="`/user?username=${comment.author}`">
        <span class="">@{{ comment.author }}</span>
      </router-link>: {{ comment.content }}
    </span>
    <p class="">
      {{ comment.dateCreated }}
    </p>
    <div v-if="$store.state.username === comment.author" class="">
      <button @click="() => deleteCommentCallback(comment._id)">Delete</button>
    </div>
    <section>
      <div class="">
        <img @click="like" src="../../public/like.svg" width="32px" height="32px" class=""/>
        <span class="">{{ comment.likes }}</span>
        <img @click="report" src="../../public/report.svg" width="32px" height="32px" class=""/>
        <span class="">{{ comment.reports }}</span>
      </div>
    </section>
  </article>
</template>

<script>

async function post_helper(url, params = {}) {
  const result = await fetch(url, {...params, method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin"});
  return await (result.ok ? result.json() : null);
}

export default {
  name: "CommentComponent",
  props: {
    comment: {
      type: Object,
      required: true,
    },
    deleteCommentCallback: { type: Function, required: true },
  },
  methods: {
    like() {
      post_helper("/api/likes", {body: JSON.stringify({parentContentId: this.comment._id, parentContentType: "comment"}),}).then((result) => {
        if (result) {
          this.comment.likes = this.comment.likes + result.countChange;

          let responseStr = "liked";
          if (result.increment <= 0){
            responseStr = "removed your like from";
          }

          this.$store.commit("alert", {message: `Note that you ${responseStr} this comment.`, status: "success"});
        } 
        else {
          this.$store.commit("alert", {message: "An error occurred when attempting to like this comment.", status: "error"});
        }
      });
    },
    report() {
      post_helper("/api/reports", {body: JSON.stringify({parentContentId: this.comment._id, parentContentType: "comment"})}).then((result) => {
        if (result) {
          this.comment.reports = this.comment.reports + result.countChange;
          
          let responseStr = "reported";
          if (result.increment <= 0){
            responseStr = "removed your report from";
          }
          
          this.$store.commit("alert", {message: `Note that you ${responseStr} this comment.`, status: "success"});
        } 
        else {
          this.$store.commit("alert", {message: "An error occurred when attempting to report this comment.", status: "error"});
        }
      });
    },
  },
};
</script>