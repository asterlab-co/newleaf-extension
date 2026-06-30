<script lang="ts">
  import { settings } from '../../state/settings.svelte';
  import { Checkbox } from '../../components';
</script>


<div class="search-settings">
  <section class="search-visibility">
    <Checkbox bind:checked={settings.showSearch}>Show search</Checkbox>
  </section>
</div>


<style>
  .search-settings {
    display: flex;
    flex-direction: column;
    gap: clamp(1.5rem, 3.33vw, 2rem);
  }
</style>
