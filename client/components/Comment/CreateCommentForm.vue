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
      url: "/api/comments", 
      method: "POST", 
      hasBody: true,
      defaultBody: {parentContentId: this.freetId, parentContentType: "freet"},
      fields: [{id: "content", label: "Content", value: ""}],
      title: "Write a new comment",
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