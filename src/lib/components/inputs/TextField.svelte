<script lang="ts">
  let {
    label,
    value = $bindable(''),
    placeholder = '',
    required = false,
    inputmode = undefined,
    error = '',
    ref = $bindable(undefined),
  }: {
    label: string
    value?: string
    placeholder?: string
    required?: boolean
    inputmode?: 'text' | 'url'
    /** Validation message shown under the input; also marks it invalid. */
    error?: string
    /** Bindable so the parent can move focus to the input. */
    ref?: HTMLInputElement
  } = $props()

  const uid = $props.id()
</script>

<label class="text-field">
  <span class="text-field__label">{label}</span>
  <input
    bind:this={ref}
    class="text-field__input"
    class:text-field__input--invalid={!!error}
    type="text"
    {inputmode}
    {placeholder}
    {required}
    aria-invalid={error ? true : undefined}
    aria-describedby={error ? `${uid}-error` : undefined}
    bind:value
  />
  {#if error}
    <span class="text-field__error" id={`${uid}-error`} role="alert">{error}</span>
  {/if}
</label>

<style>
  .text-field {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
  }

  .text-field__label {
    color: var(--color-foreground-subtle);
    font-size: 0.8125rem;
  }

  .text-field__input {
    background: transparent;
    border: 1.5px solid var(--color-border-default);
    border-radius: 0.75rem;
    color: inherit;
    font: inherit;
    padding: 0.5rem 0.75rem;
    width: 100%;
  }

  .text-field__input:focus {
    border-color: var(--color-accent-default);
    outline: none;
  }

  .text-field__input--invalid,
  .text-field__input--invalid:focus {
    border-color: var(--color-danger-default);
  }

  .text-field__error {
    color: var(--color-danger-default);
    font-size: 0.8125rem;
  }
</style>
