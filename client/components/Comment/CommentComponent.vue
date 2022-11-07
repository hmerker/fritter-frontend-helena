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
      const options = {body: JSON.stringify({parentContentId: this.freet._id, parentContentType: "freet"})};
      fetch(`/api/likes`, {...options, method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin" }).then(res => res.json()).then((res) => {
        if (res) {
          this.comment.likes = this.comment.likes + res.countChange;

          let responseStr = "liked";
          if (res.countChange <= 0){
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
      const options = {body: JSON.stringify({parentContentId: this.freet._id, parentContentType: "freet"})};
      fetch(`/api/reports`, {...options, method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin" }).then(res => res.json()).then((res) => {
        if (res) {
          this.comment.reports = this.comment.reports + res.countChange;
          
          let responseStr = "reported";
          if (res.countChange <= 0){
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