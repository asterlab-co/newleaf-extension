<script lang="ts">
  import type { Snippet } from 'svelte'

  let { children }: { children: Snippet } = $props()
</script>

<div class="screen-content">
  {@render children()}
</div>

<style>
  .screen-content {
    align-items: start;
    display: flex;
    flex-direction: column;
    gap: clamp(3rem, 5.83vw, 3.5rem);
    justify-content: end;
    min-height: 100vh;
    padding: clamp(1.25rem, 4.17vw, 2.5rem) clamp(1.25rem, 4.17vw, 2.5rem) clamp(1.75rem, 5.83vw, 3.5rem);
  }
</style>
