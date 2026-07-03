<script lang="ts">
  import { settings } from '../../state/settings.svelte';
  import { clock } from '../../state/clock.svelte';
  import { formatDate, dateFormatIds } from '../../utils/time';
  import { Checkbox } from '../../components';
</script>


<div class="date-settings">
  <section class="date-visibility">
    <Checkbox bind:checked={settings.showDate}>Show date</Checkbox>
  </section>

  {#if settings.showDate}
    <section class="date-format">
      <h2 class="section-title">Date format</h2>

      <div class="options options--stack">
        {#each dateFormatIds as id (id)}
          <button
            class="option"
            class:option--active={settings.dateFormat === id}
            aria-pressed={settings.dateFormat === id}
            onclick={() => (settings.dateFormat = id)}
          >
            {formatDate(clock.now, id)}
          </button>
        {/each}
      </div>
    </section>
  {/if}
</div>


<style>
  .date-settings {
    display: flex;
    flex-direction: column;
    gap: clamp(1.5rem, 3.33vw, 2rem);
  }

  .date-visibility,
  .date-format {
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
    gap: .75rem .625rem;
  }

  .options--stack {
    align-items: start;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: start;
    width: 100%;
  }

  .option {
    background: transparent;
    border: 1.5px solid var(--color-border-default);
    border-radius: 1.25rem;
    color: inherit;
    cursor: pointer;
    font: inherit;
    padding: .625rem 1.25rem;
  }

  .option--active {
    border-color: var(--color-accent-default);
    color: var(--color-accent-default);
  }
</style>
