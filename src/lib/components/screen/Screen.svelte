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

  // Fade the image in only once it has actually loaded, so a new tab shows a
  // calm reveal over the base color instead of a pop-in. If it never loads,
  // the layer simply stays invisible.
  let loaded = $state(false)
  $effect(() => {
    if (!background) return
    const img = new Image()
    img.onload = () => (loaded = true)
    img.src = background
  })
</script>

<div class="screen">
  {#if background}
    <div
      class="screen__bg"
      class:screen__bg--visible={loaded}
      style:background-image={`url("${background}")`}
      aria-hidden="true"
    ></div>
  {/if}
  {@render children()}
</div>

<style>
  .screen {
    min-height: 100vh;
  }

  /* Fixed full-viewport layer behind the content — the fade-friendly
     equivalent of background-attachment: fixed. */
  .screen__bg {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    inset: 0;
    opacity: 0;
    position: fixed;
    transition: opacity 400ms ease;
    z-index: -1;
  }

  .screen__bg--visible {
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    .screen__bg {
      transition-duration: 0s;
    }
  }
</style>
