<script>
  import { stores, goto } from "@sapper/app";
  import { data } from "@/api/api";
  import Graph from "@/components/graph.svelte";
</script>

<Graph data={data} on:node-dblclick={event => goto(`/${event.detail}`)} />
<slot></slot>
