<script lang="ts">
  import { clock } from '@lib/state/clock.svelte'
  import { settings } from '@lib/state/settings.svelte'
  import { formatTime, formatDate } from '@lib/utils/time'

  let { background }: { background?: string } = $props()

  let time = $derived(formatTime(clock.now, settings.timeFormat, settings.showSeconds))
  let date = $derived(formatDate(clock.now, settings.dateFormat))
</script>

<div class="datetime">
  {#if settings.showDate}
    <div class="datetime__date">{date}</div>
  {/if}
  {#if settings.showTime}
    <div
      class="datetime__time"
      class:datetime__time--masked={!!background}
      style:--clock-photo={background ? `url("${background}")` : undefined}
    >
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

  /* Show the background photo through the digits, inverted and slightly
     lightened. fixed attachment + center/cover reproduces the geometry of the
     fixed full-viewport .screen__bg layer, so the image lines up with the
     photo behind it. The photo comes from an inline --clock-photo; without a
     background the gradient above stays in effect.

     The gradient layer is a contrast floor: it paints BLACK over the photo
     before the filter runs, which invert(1) flips into a white wash on the
     final digits — keeping them legibly light even where the photo's
     mid-tones would otherwise invert to something close to the backdrop. */
  .datetime__time--masked {
    background-attachment: fixed;
    background-image:
      linear-gradient(hsl(0 0% 0% / 0.3), hsl(0 0% 0% / 0.3)),
      var(--clock-photo);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    filter: invert(1) brightness(1.1) drop-shadow(0 1px 12px hsl(0 0% 0% / 0.35));
  }
</style>
