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

export default {
  name: 'IndividualFreetPage',
  components: {
    FreetComponent,
    CreateCommentForm,
    CommentComponent,
  },
  mounted() {
    const {id} = this.$route.query;
    const options = {};
    fetch(`/api/freets?freetId=${id}`, { method: "GET" }).then(res => res.json()).then((res) => {
      if (res){
        this.freet = res;
        this.$store.state.filter = res._id;
      }
      res && fetch(`/api/comments?parentContentId=${id}`, { method: "GET" }).then(res => res.json()).then((res) => {
        if (res){
          this.comments = res;
        }
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
      fetch(`/api/comments/${commentId}`, { method: "DELETE" }).then((res) => {
        if (res.ok) {
          this.comments = this.comments.filter((comment) => comment._id !== commentId);
          this.freet.comments = this.freet.comments - 1;
          this.$store.commit('refreshComments');
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