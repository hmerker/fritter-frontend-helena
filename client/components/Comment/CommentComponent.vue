<template>
  <article style ='background-color: rgb(250, 250, 250); padding: 30px; border-radius: 8px; margin-top: 20px'>
    <span>
      <router-link :to="`/user?username=${comment.author}`">
        <span>@{{ comment.author }}</span>
      </router-link> 
      <p> {{ comment.content }} </p>
    </span>
    <p>
      {{ comment.dateCreated }}
    </p>
    <div v-if="$store.state.username === comment.author">
      <button @click="() => deleteCommentCallback(comment._id)"> 🗑️ Delete</button>
    </div>
    <section>
      <div style="padding-top:10px">
        <img @click="like" src="../../public/like.svg" width="48px" height="48px"/>
        <span>{{ comment.likes }}</span>
        <img @click="report" src="../../public/report.svg" width="48px" height="48px"/>
        <span>{{ comment.reports }}</span>
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
      const options = {body: JSON.stringify({parentContentId: this.comment._id, parentContentType: "comment"})};
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
      const options = {body: JSON.stringify({parentContentId: this.comment._id, parentContentType: "comment"})};
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

<style scoped>
img {
  padding-right: 10px;
  padding-left: 10px;
  cursor: pointer;
}
</style>