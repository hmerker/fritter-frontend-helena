<template>
  <main>
    <section>
      <header>
        <h1>Shared Freet Page</h1>
      </header>
      <h3 
        v-if="sharedFreet === null"
      >
        A shared freet does not exist with the id of '{{ this.$route.query.id }}'.
      </h3>
      <section style ='background-color: white; padding: 30px; border-radius: 8px;' v-if="sharedFreet">
        <SharedFreetComponent 
          key="sharedFreet" 
          :sharedFreet="sharedFreet" 
          :showIndividualSharedFreet="false" 
        />
      </section>
      <section>
        <h2>Comments</h2>
        <SharedFreetCreateCommentForm
          v-if="sharedFreet"
          :sharedFreetId="sharedFreet._id"
          :createCommentCallback="createCommentCallback"
        />
        <CommentComponent
          v-for="comment in comments"
          :key="comment._id"
          :comment="comment"
          :deleteCommentCallback="deleteCommentCallback"
        />
        <h4 v-if="!comments?.length || comments.length === 0">
          There are no comments found.
        </h4>
      </section>
    </section>
  </main>
</template>

<script>
import SharedFreetComponent from '@/components/SharedFreet/SharedFreetComponent.vue';
import CommentComponent from '@/components/Comment/CommentComponent.vue';
import SharedFreetCreateCommentForm from '@/components/SharedFreet/SharedFreetCreateCommentForm.vue';

export default {
  name: 'IndividualSharedFreetPage',
  components: {
    SharedFreetComponent,
    SharedFreetCreateCommentForm,
    CommentComponent,
  },
  mounted() {
    const {id} = this.$route.query;
    fetch(`/api/sharedFreets?sharedFreetId=${id}`, { method: "GET" }).then(res => res.json()).then((res) => {
      if (res){
        this.sharedFreet = res;
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
      sharedFreet: undefined, 
      comments: null
    };
  },
  methods: {
    deleteCommentCallback(commentId) {
      fetch(`/api/comments/${commentId}`, { method: "DELETE" }).then((res) => {
        if (res.ok) {
          this.sharedFreet.comments = this.sharedFreet.comments - 1;
          this.comments = this.comments.filter((comment) => comment._id !== commentId);
          this.$store.commit('refreshComments');
        }
      });
    },
    createCommentCallback(comment) {
      this.sharedFreet.comments = this.sharedFreet.comments + 1;
      this.comments.unshift(comment);
      this.$store.commit('alert', {message: 'You sucessfully created a comment.', status: 'success'});
      fetch(`/api/comments?parentContentId=${this.$store.state.filter}`, { method: "GET" }).then(res => res.json()).then((res) => {
        if (res){
          this.comments = res;
        }
      });
    },
  },
};
</script>