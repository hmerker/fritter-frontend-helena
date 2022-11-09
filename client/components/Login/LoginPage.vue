<!-- Page for account sign-in and registration -->
<!-- User should be NOT authenticated in order to see this page -->

<template>
  <main>
    <section>
      <header>
        <h2>Already have a Fritter profile?</h2>
      </header>
      <div style="background-color: white; padding: 30px; border-radius: 8px">
      <LoginForm />
      </div>
      <h3>
        New to Fritter? &nbsp;
        <router-link to="/create">
          <button>Create Account</button>
        </router-link>
      </h3>
    </section>
  </main>
</template>

<script>
import LoginForm from '@/components/Login/LoginForm.vue';

export default {
  name: 'LoginPage',
  components: {
    LoginForm,
  }
};
</script>
