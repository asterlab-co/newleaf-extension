<script lang="ts">
  import { clock } from '../state/clock.svelte'
  import { settings } from '../state/settings.svelte'
  import { formatTime, formatDate } from '../utils/time'

  let time = $derived(formatTime(clock.now, settings.timeFormat, settings.showSeconds))
  let date = $derived(formatDate(clock.now, settings.dateFormat))
</script>

<div class="clock">
  {#if settings.showDate}
    <div class="clock__date">{date}</div>
  {/if}
  {#if settings.showClock}
    <div class="clock__time">
      {time.time}{#if time.period}<span class="clock__period">{time.period}</span>{/if}
    </div>
  {/if}
</div>

<style>
  .clock {
    display: flex;
    flex-direction: column;
    gap: .25rem;
  }

  .clock__date,
  .clock__period {
    font-size: clamp(1rem, 2.5vw, 1.5rem);
    font-weight: 500;
    letter-spacing: 4%;
    line-height: 1.2;
    text-transform: uppercase;
  }

  .clock__period {
    padding-inline: .25rem;
  }

  .clock__time {
    font-size: clamp(3rem, 10vw, 6rem);
    font-weight: 700;
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
