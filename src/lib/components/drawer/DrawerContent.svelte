<script lang="ts">
  import type { Snippet } from 'svelte'

  let { children }: { children: Snippet } = $props()
</script>

<div class="drawer-content">
  {@render children()}
</div>

<style>
  .drawer-content {
    display: flex;
    flex-direction: column;
    gap: clamp(1.5rem, 3.33vw, 2rem);
    padding: clamp(1.25rem, 4.17vw, 2.5rem) clamp(1.25rem, 4.17vw, 2.5rem) clamp(1.75rem, 5.83vw, 3.5rem);
  }
</style>
