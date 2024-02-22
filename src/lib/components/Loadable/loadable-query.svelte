<script lang="ts">
  import type { OperationResultStore } from '@urql/svelte'
  import Loadable from './loadable.svelte'

  type Data = $$Generic
  type $$Slots = { default: { loaded: Data } }

  export let query: OperationResultStore<Data>
</script>

<Loadable error={$query.error} data={$query.data} let:loaded>
  <slot {loaded} />
</Loadable>
