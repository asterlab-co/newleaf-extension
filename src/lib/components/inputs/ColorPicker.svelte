<script lang="ts">
  import { LINK_COLOR_PRESETS } from '../../utils/links'

  let { value = $bindable() }: { value: string } = $props()

  let pickerInput = $state<HTMLInputElement>()

  // A color picked outside the presets shows on (and highlights) the custom swatch.
  let isCustom = $derived(!LINK_COLOR_PRESETS.includes(value))

  /** Open the native color picker seeded with a starting color. */
  function openPicker(seed: string) {
    value = seed
    if (!pickerInput) return
    // Sync the input's DOM value directly: showPicker() must run inside the
    // user gesture, before Svelte flushes the binding.
    pickerInput.value = seed
    try {
      pickerInput.showPicker()
    } catch {
      // showPicker() can be refused (e.g. no user gesture); a click on the
      // input opens the same dialog.
      pickerInput.click()
    }
  }
</script>

<div class="color-picker">
  {#each LINK_COLOR_PRESETS as preset (preset)}
    <button
      type="button"
      class="swatch"
      style:background-color={preset}
      aria-label={`Color ${preset}`}
      aria-pressed={value === preset}
      title={`${preset} — double-click to customize`}
      onclick={() => (value = preset)}
      ondblclick={() => openPicker(preset)}
    ></button>
  {/each}

  <button
    type="button"
    class="swatch swatch--custom"
    style:background-color={isCustom ? value : null}
    style:background-image={isCustom ? 'none' : null}
    aria-label="Custom color"
    aria-pressed={isCustom}
    title="Custom color"
    onclick={() => openPicker(value)}
  ></button>

  <!-- Hidden input backing the native picker; kept rendered (not display:none)
       so showPicker() is allowed and the dialog anchors near the swatches. -->
  <input
    bind:this={pickerInput}
    class="picker"
    type="color"
    bind:value
    tabindex="-1"
    aria-hidden="true"
  />
</div>

<style>
  /* Wraps only when the drawer is too narrow for the single row. The swatch
     buttons carry their own spacing (ring padding), so the gap stays small. */
  .color-picker {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 0.125rem;
    position: relative;
  }

  /* The visible circle is the content box; the transparent border becomes the
     selection ring. Everything paints inside the button, so nothing is clipped
     by the form's overflow and the hit target stays comfortably large. */
  .swatch {
    aspect-ratio: 1;
    background-clip: content-box;
    border: 2px solid transparent;
    border-radius: 50%;
    cursor: pointer;
    flex-shrink: 0;
    padding: 0.1875rem;
    width: 2rem;
  }

  .swatch[aria-pressed='true'] {
    border-color: var(--color-accent-default);
  }

  .swatch--custom {
    background-image: conic-gradient(
      hsl(0 70 70),
      hsl(60 70 70),
      hsl(120 70 70),
      hsl(180 70 70),
      hsl(240 70 70),
      hsl(300 70 70),
      hsl(360 70 70)
    );
  }

  .picker {
    border: 0;
    height: 0;
    opacity: 0;
    padding: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    width: 0;
  }
</style>
