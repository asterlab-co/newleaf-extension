<script lang="ts">
  import { Dashboard, Settings } from './lib/layouts'

  let view = $state<'main' | 'settings'>('main')
</script>

<Dashboard onNavigate={() => (view = 'settings')} />
<Settings open={view === 'settings'} onBack={() => (view = 'main')} />
