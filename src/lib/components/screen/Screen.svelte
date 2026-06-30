<script lang="ts">
  import type { Snippet } from 'svelte'

  let {
    background,
    children,
  }: {
    /** Optional full-bleed background image URL for the screen. */
    background?: string
    children: Snippet
  } = $props()
</script>

<div
  class="screen"
  style:--screen-bg={background ? `url("${background}")` : null}
>
  {@render children()}
</div>

<style>
  .screen {
    background-attachment: fixed;
    background-image: var(--screen-bg);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    min-height: 100vh;
  }
</style>
