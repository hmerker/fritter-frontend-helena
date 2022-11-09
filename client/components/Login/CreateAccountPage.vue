<template>
  <main>
    <section>
      <header>
        <h2>New to Fritter?</h2>
      </header>
      <div style="background-color: white; padding: 30px; border-radius: 8px">
      <RegisterForm />
      </div>
      <h3>
        Already have a Fritter profile? &nbsp;
        <router-link to="/login">
          <button>Sign In</button>
        </router-link>
      </h3>
    </section>
  </main>
</template>

<script>
import RegisterForm from '@/components/Login/RegisterForm.vue';

export default {
  name: 'CreateAccountPage',
  components: {
    RegisterForm,
  },
};
</script>