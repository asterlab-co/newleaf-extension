<script lang="ts">
  let { open = false, onClick }: { open?: boolean; onClick: () => void } = $props()
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<!-- Scrim is decorative; Escape and the in-panel close button cover keyboard users. -->
<div class="drawer-scrim" class:open onclick={onClick} aria-hidden="true"></div>

<style>
  .drawer-scrim {
    backdrop-filter: blur(.25rem);
    background: hsl(from var(--color-background-dark) h s l / 0.6);
    cursor: pointer;
    inset: 0;
    opacity: 0;
    position: absolute;
    transition: opacity 250ms ease;
  }

  .drawer-scrim.open {
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    .drawer-scrim {
      transition-duration: 0ms;
    }
  }
</style>
