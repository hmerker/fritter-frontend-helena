<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit" class="">
    <h3>{{ title }}</h3>
    <article v-if="fields.length">
      <div v-for="field in fields" :key="field.id">
        <label :for="field.id">{{ field.label }}:</label>
        <textarea
          v-if="field.id === 'content'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
        <input
          v-else
          :type="field.id === 'password' ? 'password' : 'text'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
      </div>
    </article>
    <article v-else>
      <p>{{ content }}</p>
    </article>
    <button type="submit">
      {{ title }}
    </button>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
</template>

<script>

async function post_helper(url, params = {}) {
  const result = await fetch(url, {...params, method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin"});
  return await (result.ok ? result.json() : null);
}

export default {
  name: "BlockForm",
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      url: "", // Url to submit form to
      method: "GET", // Form request method
      hasBody: false, // Whether or not form request has a body
      setUsername: false, // Whether or not stored username should be updated after form submission
      refreshFreets: false,
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null, // Function to run after successful form submission
    };
  },
  methods: {
    async submit() {
      /**
       * Submits a form with the specified options from data().
       */
      const options = {
        method: this.method,
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // Sends express-session credentials with request
      };
      if (this.hasBody) {
        let defaultStuff = {};
        if (this.defaultBody !== null && this.defaultBody !== undefined){
          defaultStuff = this.defaultBody;
        }
        options.body = JSON.stringify({...Object.fromEntries(
          this.fields.map((field) => {
            const {id, value} = field;
            field.value = '';
            return [id, value];
          })
        ),
        ...defaultStuff,
        });
      }

      try {
        const result = await post_helper(this.url, options);
        if (!result) {
          throw new Error("An error has occurred.");
        }
        if (this.setUsername) {
          this.$store.commit('setUsername', result.user ? result.user.username : null);
          this.$store.commit('setUserId', result.user ? result.user._id : null);
        }
        if (this.refreshFreets) {
          this.$store.commit('refreshFreets');
        }
        if (this.callback) {
          this.callback(result);
        }
      } 
      catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    },
  },
};
</script>

<style scoped>
form {
  border: 1px solid #111;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}

article > div {
  display: flex;
  flex-direction: column;
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

textarea {
  font-family: inherit;
  font-size: inherit;
}
</style>
