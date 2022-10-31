<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
  name: "CreateCommentForm",
  mixins: [BlockForm],
  props: {
    freetId: {
      type: String,
      required: true,
    },
    createCommentCallback: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      url: '/api/comments',
      method: 'POST',
      hasBody: true,
      defaultBody: {parentContentId: this.freetId, parentContentType: 'freet'},
      fields: [
          {id: 'content', label: 'Content', value: ''}
        ],
      title: 'Create a comment',
      callback: (comment) => {
        this.createCommentCallback(comment.comment);
        const message = 'Successfully created a comment!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      },
    };
  },
};
</script>