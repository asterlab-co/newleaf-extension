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

  // Only paint an image once it has actually loaded, so a new tab shows a calm
  // reveal over the base color instead of a pop-in, and swapping backgrounds
  // keeps the old one until the next is ready. If it never loads, the layer
  // simply stays invisible. Late loads from a superseded URL are discarded.
  let shown = $state<string | undefined>(undefined)
  $effect(() => {
    if (!background) return
    let current = true
    const img = new Image()
    img.onload = () => { if (current) shown = background }
    img.src = background
    return () => { current = false }
  })
</script>

<div class="screen">
  {#if background}
    <div
      class="screen__bg"
      class:screen__bg--visible={shown}
      style:background-image={shown ? `url("${shown}")` : undefined}
      aria-hidden="true"
    ></div>
  {/if}
  {@render children()}
</div>

<style>
  .screen {
    min-height: 100vh;
  }

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

  /* Backdrop blur lives on its own layer, masked so it ramps from sharp at
     the top edge of the band to fully blurred at the bottom. It must stay
     separate from ::after — a mask also hides the element's own background,
     so it would erase the gradient where it's darkest. */
  .screen__bg::before {
    backdrop-filter: blur(1.5rem);
    -webkit-backdrop-filter: blur(1.5rem);
    bottom: 0;
    content: '';
    height: 20rem;
    mask-image: linear-gradient(to bottom, transparent, black);
    -webkit-mask-image: linear-gradient(to bottom, transparent, black);
    position: absolute;
    width: 100%;
  }

  .screen__bg::after {
    background: linear-gradient(to bottom, transparent, var(--color-background-dark) 90%);
    bottom: 0;
    content: '';
    height: 40rem;
    position: absolute;
    width: 100%;
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
