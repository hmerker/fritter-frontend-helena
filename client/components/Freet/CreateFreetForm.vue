<!-- Form for creating freets (block style) -->

<script>
import CreateFreetBlockForm from '@/components/Freet/CreateFreetBlockForm.vue';

export default {
  name: 'CreateFreetForm',
  mixins: [CreateFreetBlockForm],
  data() {
    return {
      url: '/api/freets',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Content', value: ''},
        {id: 'source', label: 'Source', value: ''}
      ],
      title: 'Create a Freet',
      refreshFreets: true,
      callback: () => {
        const message = 'Successfully created a freet!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
