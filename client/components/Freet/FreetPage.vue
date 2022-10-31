
<template>
  <main>
    <section>
      <header>
        <h1>Freet Page</h1>
      </header>
      <h3 class="" v-if="freet === null">
        This freet does not exist.
      </h3>
      <section v-if="freet">
        <FreetComponent key="freet" :freet="freet"/>
      </section>
      <section>
        <h2>Freet Comments</h2>
        <CreateCommentForm
          v-if="freet"
          :freetId="freet._id"
          :createCommentCallback="(comment) => {comments.unshift(comment);}"
        />
        <CommentComponent
          v-for="comment in comments"
          :key="comment._id"
          :comment="comment"
          :deleteCommentCallback="deleteCommentCallback"
        />
        <h3 v-if="comments?.length === null || comments?.length === 0">There are no comments found.</h3>
      </section>
    </section>
  </main>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";
import CommentComponent from "@/components/Comment/CommentComponent.vue";
import CreateCommentForm from "@/components/Comment/CreateCommentForm.vue";

async function get_helper(url, params = {}) {
  const get_result = await fetch(url, { ...params, method: "GET" });
  return await (get_result.ok ? get_result.json() : null);
}

async function delete_helper(url, params = {}) {
  const delete_result = await fetch(url, { ...params, method: "DELETE" });
  return await (delete_result.ok ? delete_result.json() : null);
}

export default {
  name: "FreetPage",
  components: {
    FreetComponent,
    CreateCommentForm,
    CommentComponent,
  },
  mounted() {
    const {freetId} = this.$route.query;
    get_helper(`/api/freets?freetId=${freetId}`).then((res) => {
      this.freet = res ?? null;
      res && get_helper(`/api/comments?parentContentId=${freetId}`).then((res) => {this.comments = res;});
    });
  },
  data() {
    return {freet: undefined, comments: null};
  },
  methods: {
    deleteCommentCallback(commentId) {
      delete_helper(`/api/comments/${commentId}`).then((res) => {
        if (res) {
          var filteredComments = this.comments.filter((comment) => comment._id !== commentId)
          this.comments = filteredComments;
        }
      });
    },
  },
};
</script>