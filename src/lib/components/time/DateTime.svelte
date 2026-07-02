<script lang="ts">
  import { clock } from '../../state/clock.svelte'
  import { settings } from '../../state/settings.svelte'
  import { formatTime, formatDate } from '../../utils/time'

  let time = $derived(formatTime(clock.now, settings.timeFormat, settings.showSeconds))
  let date = $derived(formatDate(clock.now, settings.dateFormat))
</script>

<div class="datetime">
  {#if settings.showDate}
    <div class="datetime__date">{date}</div>
  {/if}
  {#if settings.showTime}
    <div class="datetime__time">
      {time.time}{#if time.period}<span class="datetime__period">{time.period}</span>{/if}
    </div>
  {/if}
</div>

<style>
  .datetime {
    display: flex;
    flex-direction: column;
    gap: .1875rem;
  }

  .datetime__date,
  .datetime__period {
    font-size: clamp(.875rem, 2.08vw, 1.25rem);
    font-weight: 500;
    letter-spacing: 4%;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .datetime__period {
    padding-inline: .25rem;
  }

  .datetime__time {
    font-size: clamp(3rem, 10vw, 6rem);
    font-weight: 800;
    line-height: 1.05;

    /* gradient background */
    -webkit-background-clip: text;
    background: linear-gradient(
      to bottom,
      var(--color-foreground-strong),
      hsl(from var(--color-foreground-default) h s l / .8)
    );
    background-clip: text;
    color: transparent;
  }
</style>
