<script lang="ts">
  import type { Snippet } from 'svelte'
  import DrawerScrim from './DrawerScrim.svelte'

  let {
    open = false,
    onClose,
    label,
    children,
  }: {
    open?: boolean
    onClose: () => void
    /** Accessible name for the dialog, since the panel has no fixed heading. */
    label: string
    children: Snippet
  } = $props()

  let panel = $state<HTMLDivElement>()

  // Modal focus handling: move focus into the panel when it opens and restore it
  // to whatever was focused before (e.g. the button that opened the drawer) on
  // close. Body scroll is locked while open so the page behind the scrim stays put.
  $effect(() => {
    if (!open) return

    const lastFocused = document.activeElement as HTMLElement | null
    panel?.focus()
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
      lastFocused?.focus()
    }
  })

  function onKeydown(e: KeyboardEvent) {
    if (open && e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

<!-- Always mounted; `open` drives CSS transitions. CSS transitions animate from
     the current computed value, so rapid toggling just reverses smoothly and can
     never strand the panel mid-slide. `inert` when closed makes the whole overlay
     ignore pointer events (clicks fall through to the page beneath) and drops its
     content out of the tab order.

     DO NOT convert this to mounting/unmounting with JS transitions (Svelte
     `transition:`/`in:`/`out:` behind an {#if}). Under rapid open/close the
     separate intro/outro state machines desync and strand the content off-screen
     while the overlay still reads as "open". The always-mounted + CSS-transition
     approach here is interruption-safe by design; keep it that way. -->

<div class="drawer" class:open inert={!open}>
  <DrawerScrim {open} onClick={onClose} />

  <div
    class="drawer__panel"
    bind:this={panel}
    role="dialog"
    aria-modal="true"
    aria-label={label}
    tabindex="-1"
  >
    {@render children()}
  </div>
</div>

<style>
  .drawer {
    inset: 0;
    position: fixed;
    z-index: 100;
  }

  .drawer__panel {
    background: var(--color-background-default);
    box-shadow: -0.25rem 0 2rem hsl(from var(--color-background-dark) h s l / 0.4);
    color: var(--color-foreground-default);
    height: 100%;
    outline: none;
    overflow-y: auto;
    position: absolute;
    right: 0;
    top: 0;
    /* Park past 100% so the left-reaching shadow clears the viewport too. */
    transform: translateX(calc(100% + 3rem));
    /* easeOutCubic */
    transition: transform 250ms cubic-bezier(0.33, 1, 0.68, 1);
    width: min(100%, 50rem);
  }

  .drawer.open .drawer__panel {
    transform: translateX(0);
  }

  @media (prefers-reduced-motion: reduce) {
    .drawer__panel {
      transition-duration: 0ms;
    }
  }
</style>
