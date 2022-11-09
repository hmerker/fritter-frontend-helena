<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article 
    class="freet"
  >
    <header>
      <router-link class="" :to="`/user?username=${freet.author}`">
        <h3 class="">
          @{{ freet.author }}
        </h3>
      </router-link>
    </header>
    <textarea
      v-if="editing"
      class="content"
      :value="draft"
      @input="draft = $event.target.value"
    />
    <p 
      v-else 
      class="content"
    >
      {{ freet.content }}
    </p>
    <h5 v-if='freet.source && freet.source !== "none"'> <b>Source:</b> {{freet.source}}</h5>
    <p>
      Posted at {{ freet.dateModified }}
    </p>
    <div
      v-if="$store.state.username === freet.author && showIndividualFreet"
      class="actions"
    >
      <button 
        v-if="editing" 
        @click="submitEdit"
      >
        ✅ Save changes
      </button>
      <button 
        v-if="editing" 
        @click="stopEditing" 
        class=""
      >
        🚫 Discard changes
      </button>
      <button 
        v-if="!editing" 
        @click="startEditing" 
        class=""
      >
        ✏️ Edit
      </button>
      <button @click="deleteFreet">
        🗑️ Delete
      </button>
    </div>
    <router-link
      class=""
      v-if="showIndividualFreet"
      :to="`/freet?id=${freet._id}`"
    >
      Show All Comments
    </router-link>
    <section style="padding-top:10px">
      <div v-if="$store.state.username" class="">
        <img @click="like" src="../../public/like.svg" width="48px" height="48px" />
        <span>{{freet.likes}}</span>
        <img @click="report" src="../../public/report.svg" width="48px" height="48px" />
        <span>{{freet.reports}}</span>
        <img src="../../public/comment.svg" width="48px" height="48px" />
        <span>{{freet.comments}}</span>
      </div>
      <div v-else class="">
        <img src="../../public/like.svg" width="48px" height="48px" />
        <span >{{freet.likes}}</span>
        <img src="../../public/report.svg" width="48px" height="48px" />
        <span >{{freet.reports}}</span>
        <img src="../../public/comment.svg" width="48px" height="48px" />
        <span >{{freet.comments}}</span>
      </div>
    </section>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </article>
</template>

<script>

export default {
  name: "FreetComponent",
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true,
    },
    showIndividualFreet: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    like() {
      const options = {body: JSON.stringify({parentContentId: this.freet._id, parentContentType: "freet"})};
      fetch(`/api/likes`, {...options, method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin" }).then(res => res.json()).then((res) => {
        if (res) {
          this.freet.likes = this.freet.likes + res.countChange;

          let responseStr = "liked";
          if (res.countChange <= 0){
            responseStr = "removed your like from";
          }

          this.$store.commit("alert", {message: `Note that you ${responseStr} this freet.`, status: "success"});
        } 
        else {
          this.$store.commit("alert", {message: "An error occurred when attempting to like this freet.", status: "error"});
        }
      });
    },
    report() {
      const options = {body: JSON.stringify({parentContentId: this.freet._id, parentContentType: "freet"})};
      fetch(`/api/reports`, {...options, method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin" }).then(res => res.json()).then((res) => {
        if (res) {
          this.freet.reports = this.freet.reports + res.countChange;
          
          let responseStr = "reported";
          if (res.countChange <= 0){
            responseStr = "removed your report from";
          }
          
          this.$store.commit("alert", {message: `Note that you ${responseStr} this freet.`, status: "success"});
        } 
        else {
          this.$store.commit("alert", {message: "An error occurred when attempting to report this freet.", status: "error"});
        }
      });
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!',
            status: 'success',
          });
        },
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }
      
      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }
      
      try {
        const r = await fetch(`/api/freets/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
.freet {
  border: 1px solid #111;
  padding: 20px;
  position: relative;
}
img {
  padding-right: 10px;
  padding-left: 10px;
  cursor: pointer;
}
</style>