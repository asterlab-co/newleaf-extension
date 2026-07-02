<script lang="ts">
  import { settings } from '../../state/settings.svelte';
  import { type TimeFormat } from '../../utils/time';
  import { Checkbox } from '../../components';

  const timeFormats: { id: TimeFormat; label: string }[] = [
    { id: '12h', label: '12-hour' },
    { id: '24h', label: '24-hour' },
  ]
</script>


<div class="time-settings">
  <section class="time-visibility">
    <Checkbox bind:checked={settings.showTime}>Show time</Checkbox>
  </section>

  {#if settings.showTime}
    <section class="time-format">
      <h2 class="section-title">Time format</h2>
      <div class="options">
        {#each timeFormats as option (option.id)}
          <button
            class="option"
            class:option--active={settings.timeFormat === option.id}
            aria-pressed={settings.timeFormat === option.id}
            onclick={() => (settings.timeFormat = option.id)}
          >
            {option.label}
          </button>
        {/each}
      </div>
      <Checkbox bind:checked={settings.showSeconds}>Show seconds</Checkbox>
    </section>
  {/if}
</div>


<style>
  .time-settings {
    display: flex;
    flex-direction: column;
    gap: clamp(1.5rem, 3.33vw, 2rem);
  }

  .time-visibility,
  .time-format {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .section-title {
    color: var(--color-foreground-subtle);
    font-size: 1.125rem;
    font-weight: 600;
    letter-spacing: 4%;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .options {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .option {
    background: transparent;
    border: 1px solid var(--color-slate-80);
    border-radius: 0.5rem;
    color: inherit;
    cursor: pointer;
    font: inherit;
    padding: 0.5rem 1rem;
  }

  .option--active {
    border-color: var(--color-accent-default);
    color: var(--color-accent-default);
  }

  /* A checkbox sitting below the format options needs the same gap.
     `.check` lives inside the Checkbox component, so it must be reached globally. */
  .options + :global(.check) {
    margin-top: 0.75rem;
  }
</style>
