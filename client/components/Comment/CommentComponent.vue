<template>
  <article class= ''>
    <router-link :to="`/user?username=${comment.author}`">@{{comment.author}}</router-link>
      :{{comment.content}}
    <p class= ''>
      {{comment.dateCreated}}
    </p>
    <div v-if="$store.state.username === comment.author" class='actions'>
      <button @click="() => deleteCommentCallback(comment._id)">Delete</button>
    </div>
  </article>
</template>

<script>
export default {
  name: 'CommentComponent',
  props: {
    comment: {
      type: Object,
      required: true,
    },
    deleteCommentCallback: {type: Function, required: true},
  },
};
</script>