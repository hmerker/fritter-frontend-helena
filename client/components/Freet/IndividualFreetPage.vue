<template>
  <main>
    <section>
      <header>
        <h1>Individual Freet Page</h1>
      </header>
      <h3 
        class="" 
        v-if="freet === null"
      >
        A freet does not exist with the id of '{{ this.$route.query.id }}'.
      </h3>
      <section v-if="freet">
        <FreetComponent 
          key="freet" 
          :freet="freet" 
          :showIndividualFreet="false" 
        />
      </section>
      <section>
        <h2>Comments</h2>
        <CreateCommentForm
          v-if="freet"
          :freetId="freet._id"
          :createCommentCallback="createCommentCallback"
        />
        <CommentComponent
          v-for="comment in comments"
          :key="comment._id"
          :comment="comment"
          :deleteCommentCallback="deleteCommentCallback"
        />
        <h3 v-if="!comments?.length">There are no comments found.</h3>
      </section>
    </section>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CommentComponent from '@/components/Comment/CommentComponent.vue';
import CreateCommentForm from '@/components/Comment/CreateCommentForm.vue';

async function get_helper(url, params = {}) {
  const result = await fetch(url, { ...params, method: "GET" });
  return await (result.ok ? result.json() : null);
}

async function delete_helper(url, params = {}) {
  const result = await fetch(url, { ...params, method: "DELETE" });
  return await (result.ok ? result.json() : null);
}

export default {
  name: 'IndividualFreetPage',
  components: {
    FreetComponent,
    CreateCommentForm,
    CommentComponent,
  },
  mounted() {
    const {id} = this.$route.query;
    get_helper(`/api/freets?freetId=${id}`).then((result) => {
      this.freet = null;
      if (result !== null && result !== undefined){
        this.freet = result;
      }
      result && get_helper(`/api/comments?parentContentId=${id}`).then((result) => {
        this.comments = result;
      });
    });
  },
  data() {
    return {
      freet: undefined, 
      comments: null
    };
  },
  methods: {
    deleteCommentCallback(commentId) {
      delete_helper(`/api/comments/${commentId}`).then((result) => {
        if (result) {
          this.comments = this.comments.filter((comment) => comment._id !== commentId);
          this.freet.comments = this.freet.comments - 1;
        }
      });
    },
    createCommentCallback(comment) {
      this.comments.unshift(comment);
      this.freet.comments = this.freet.comments + 1;
      this.$store.commit('alert', {message: 'You sucessfully created a comment.', status: 'success'});
    },
  },
};
</script>