<script lang="ts">
  import { settings } from '@lib/state/settings.svelte';
  import { backgrounds } from '@lib/utils/backgrounds';
  import { BackgroundThumbnail, Checkbox } from '@lib/components';

  // "Use all" is its own setting rather than a full id list, so unchecking can
  // clear the grid to an empty selection and still be told apart from it.
  const useAll = $derived(settings.useAllBackgrounds)
  const chosen = $derived(settings.backgroundIds)
  const count = $derived(useAll ? backgrounds.length : chosen.length)

  function setUseAll(next: boolean) {
    settings.useAllBackgrounds = next
    settings.backgroundIds = []
  }

  function toggle(id: string) {
    if (useAll) {
      // Every tile reads as picked while "use all" is on, so the first click is
      // a removal from the full set rather than the start of a new selection.
      settings.useAllBackgrounds = false
      settings.backgroundIds = backgrounds
        .map((background) => background.id)
        .filter((chosenId) => chosenId !== id)
      return
    }
    settings.backgroundIds = chosen.includes(id)
      ? chosen.filter((chosenId) => chosenId !== id)
      : [...chosen, id]
  }
</script>


<div class="background-settings">

  <section class="background-picker">
    <div class="background-picker__header">
      <h2 class="section-title">Background images</h2>
      <Checkbox checked={useAll} onChange={setUseAll}>Use all {backgrounds.length} images</Checkbox>
    </div>

    <p class="background-picker__hint">
      {#if useAll}
        One image is chosen at random each time you open a new tab. Deselect any images to exclude them from the rotation. If none are selected, all images remain in the rotation.
      {:else if count === 0}
        No background images selected. All images remain in the rotation.
      {:else if count === 1}
        One image shown on every new tab.
      {:else}
        {count} images in rotation, with one chosen at random for each new tab.
      {/if}
    </p>

    <ul class="background-picker__grid">
      {#each backgrounds as background (background.id)}
        <li>
          <BackgroundThumbnail
            url={background.thumbUrl}
            location={background.location}
            selected={useAll || chosen.includes(background.id)}
            onToggle={() => toggle(background.id)}
          />
        </li>
      {/each}
    </ul>
  </section>

  <section class="background-note">
    <Checkbox bind:checked={settings.showBackgroundNote}>Show image location inspiration</Checkbox>
  </section>
  <p class="disclaimer">
    All background images are AI-generated. These images are inspired by real places
    but aren't photographs of them.
  </p>
</div>


<style>
  .background-settings {
    display: flex;
    flex-direction: column;
    gap: clamp(1.5rem, 3.33vw, 2rem);
  }

  .background-note,
  .background-picker {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* Heading left, "use all" toggle right — the same row as Your links. */
  .background-picker__header {
    align-items: center;
    display: flex;
    gap: 1rem;
    justify-content: space-between;
  }

  .background-picker__header :global(.check) {
    font-size: var(--font-size-small);
  }

  .section-title {
    color: var(--color-foreground-subtle);
    font-size: 1.125rem;
    font-weight: 600;
    letter-spacing: 4%;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .background-picker__hint {
    color: var(--color-foreground-subtle);
    font-size: var(--font-size-small);
  }

  /* Sits below the grid, quieter than the hint text above it: it's a standing
     fact about the images, not guidance about the controls. */
  .disclaimer {
    border-block-start: 1px solid var(--color-border-subtle);
    color: var(--color-foreground-subtle);
    font-size: var(--font-size-xsmall);
    line-height: 1.5;
    padding-block-start: 1rem;
  }

  .background-picker__grid {
    display: grid;
    gap: 0.625rem;
    grid-template-columns: repeat(auto-fill, minmax(7.5rem, 1fr));
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
