<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
  name: "SharedFreetCreateCommentForm",
  mixins: [BlockForm],
  props: {
    sharedFreetId: {
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
      url: "/api/comments", 
      method: "POST", 
      hasBody: true,
      defaultBody: {parentContentId: this.sharedFreetId, parentContentType: "shared_freet"},
      fields: [{id: "content", label: "Content", value: ""}],
      title: "Write a New Comment",
      refreshComments: true,
      callback: (comment) => {
        this.createCommentCallback(comment);
        this.$set(this.alerts, "Comment was successfully created.", "success");
        setTimeout(() => this.$delete(this.alerts, "Comment was successfully created."), 3000);
      },
    };
  },
};
</script>