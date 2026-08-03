<script lang="ts">
  import { ArrowsClockwiseIcon, MapPinIcon } from 'phosphor-svelte'
  import { settings } from '@lib/state/settings.svelte'
  import IconButton from '../buttons/IconButton.svelte'

  let { location, onRefresh }: {
    /** Place the current background's scene evokes. Omitted images show nothing. */
    location?: string
    /** Swap in another random background. Omitted hides the refresh button. */
    onRefresh?: () => void
  } = $props()
</script>

{#if location && settings.showBackgroundNote}
  <p class="background-note">
    <i class="background-note__icon"><MapPinIcon aria-hidden="true" /></i>
    <span class="background-note__text">{location}</span>
    {#if onRefresh}
      <IconButton label="Show another background" onclick={onRefresh}>
        {#snippet icon()}
          <ArrowsClockwiseIcon />
        {/snippet}
      </IconButton>
    {/if}
  </p>
{/if}

<style>
  /* Centered along the very bottom edge, inside the blur + gradient band Screen
     already paints across the bottom of the image, so it needs no scrim of its
     own. It sits below ScreenContent's bottom padding, clear of the clock and
     links at every width. */
  .background-note {
    align-items: center;
    bottom: clamp(0.875rem, 2.7vw, 1.625rem);
    color: var(--color-foreground-subtle);
    display: flex;
    font-size: var(--font-size-xsmall);
    gap: 0.3125rem;
    justify-content: center;
    left: 0;
    letter-spacing: 2%;
    line-height: 1.2;
    padding-inline: clamp(1.25rem, 4.17vw, 2.5rem);
    position: absolute;
    right: 0;
  }

  .background-note__icon {
    font-size: 120%;
    line-height: 1;
    margin-block-end: -.125rem;
  }

  .background-note__text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
