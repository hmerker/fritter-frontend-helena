<!-- Form for creating shared freets (block style) -->

<script>
import SharedFreetBlockForm from '@/components/SharedFreet/SharedFreetBlockForm.vue';

export default {
  name: 'CreateSharedFreetForm',
  mixins: [SharedFreetBlockForm],
  data() {
    return {
      url: '/api/sharedFreets',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Content', value: ''},
        {id: 'author1', label: 'Author 1', value: ''},
        {id: 'author2', label: 'Author 2', value: ''},
        {id: 'author3', label: 'Author 3', value: ''},
        {id: 'author4', label: 'Author 4', value: ''},
      ],
      title: 'Create a Shared Freet',
      refreshSharedFreets: true,
      callback: () => {
        const message = 'Successfully created a shared freet!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
