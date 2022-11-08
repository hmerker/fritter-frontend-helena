<!-- Reusable component representing a single shared freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article 
    class="sharedFreet"
  >
    <header>
      <router-link class="" :to="`/user?username=${sharedFreet.author}`">
        <h3 class="">
          @{{ sharedFreet.author }}
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
      {{ sharedFreet.content }}
    </p>
    <p class="info">
      Posted at {{ sharedFreet.dateModified }}
      <i v-if="sharedFreet.edited">(edited)</i>
    </p>
    <div
      v-if="$store.state.username === sharedFreet.author && showIndividualSharedFreet"
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
      <button @click="deleteSharedFreet">
        🗑️ Delete
      </button>
    </div>
    <router-link
      class=""
      v-if="showIndividualSharedFreet"
      :to="`/sharedFreet?id=${sharedFreet._id}`"
    >
      Show All Comments
    </router-link>
    <section style="padding-top:10px">
      <div v-if="$store.state.username" class="">
        <img @click="like" src="../../public/like.svg" width="48px" height="48px" />
        <span>{{sharedFreet.likes}}</span>
        <img @click="report" src="../../public/report.svg" width="48px" height="48px" />
        <span>{{sharedFreet.reports}}</span>
        <img src="../../public/comment.svg" width="48px" height="48px" />
        <span>{{sharedFreet.comments}}</span>
      </div>
      <div v-else class="">
        <img src="../../public/like.svg" width="48px" height="48px" />
        <span >{{sharedFreet.likes}}</span>
        <img src="../../public/report.svg" width="48px" height="48px" />
        <span >{{sharedFreet.reports}}</span>
        <img src="../../public/comment.svg" width="48px" height="48px" />
        <span >{{sharedFreet.comments}}</span>
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
  name: "SharedFreetComponent",
  props: {
    // Data from the stored shared freet
    sharedFreet: {
      type: Object,
      required: true,
    },
    showIndividualSharedFreet: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.sharedFreet.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.sharedFreet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.sharedFreet.content;
    },
    like() {
      const options = {body: JSON.stringify({parentContentId: this.sharedFreet._id, parentContentType: "shared_freet"})};
      fetch(`/api/likes`, {...options, method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin" }).then(res => res.json()).then((res) => {
        if (res) {
          this.sharedFreet.likes = this.sharedFreet.likes + res.countChange;

          let responseStr = "liked";
          if (res.countChange <= 0){
            responseStr = "removed your like from";
          }

          this.$store.commit("alert", {message: `Note that you ${responseStr} this shared freet.`, status: "success"});
        } 
        else {
          this.$store.commit("alert", {message: "An error occurred when attempting to like this shared freet.", status: "error"});
        }
      });
    },
    report() {
      const options = {body: JSON.stringify({parentContentId: this.sharedFreet._id, parentContentType: "shared_freet"})};
      fetch(`/api/reports`, {...options, method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin" }).then(res => res.json()).then((res) => {
        if (res) {
          this.sharedFreet.reports = this.sharedFreet.reports + res.countChange;
          
          let responseStr = "reported";
          if (res.countChange <= 0){
            responseStr = "removed your report from";
          }
          
          this.$store.commit("alert", {message: `Note that you ${responseStr} this shared freet.`, status: "success"});
        } 
        else {
          this.$store.commit("alert", {message: "An error occurred when attempting to report this shared freet.", status: "error"});
        }
      });
    },
    deleteSharedFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted shared freet!',
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
      if (this.sharedFreet.content === this.draft) {
        const error = 'Error: Edited shared freet content should be different than current shared freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited shared freet!',
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
        const r = await fetch(`/api/sharedFreets/${this.sharedFreet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshSharedFreets');

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
.sharedFreet {
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