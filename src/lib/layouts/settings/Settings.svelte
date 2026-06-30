<script lang="ts">
  import { Drawer, DrawerCloseButton, DrawerContent, TabGroup } from '../../components'
  import DateSettings from './DateSettings.svelte'
  import TimeSettings from './TimeSettings.svelte'
  import SearchSettings from './SearchSettings.svelte'
  import LinksSettings from './LinksSettings.svelte'

  let { open = false, onBack }: { open?: boolean; onBack: () => void } = $props()

  const tabs = [
    { id: 'date', label: 'Date' },
    { id: 'time', label: 'Time' },
    { id: 'search', label: 'Search' },
    { id: 'links', label: 'Links' },
  ]
  let activeTab = $state('date')
</script>

<Drawer {open} onClose={onBack} label="Settings">
  <DrawerContent>
    <h1>Settings</h1>

    <TabGroup {tabs} bind:active={activeTab} />

    {#if activeTab === 'date'}
      <div role="tabpanel" aria-labelledby="tab-date">
        <DateSettings />
      </div>
    {:else if activeTab === 'time'}
      <div role="tabpanel" aria-labelledby="tab-time">
        <TimeSettings />
      </div>
    {:else if activeTab === 'search'}
      <div role="tabpanel" aria-labelledby="tab-search">
        <SearchSettings />
      </div>
    {:else if activeTab === 'links'}
      <div role="tabpanel" aria-labelledby="tab-links">
        <LinksSettings />
      </div>
    {/if}
  </DrawerContent>

  <DrawerCloseButton onClose={onBack} />
</Drawer>
