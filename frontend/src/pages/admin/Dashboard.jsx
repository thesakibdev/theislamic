import CounterUp from "@/components/common/CounterUp";

import { useVisitorQuery, useCounterQuery } from "@/slices/utils";

export default function Dashboard() {
  const { data: visitor } = useVisitorQuery();
  const { data: counter } = useCounterQuery();

  return (
    <div className="bg-primary-foreground">
      <CounterUp data={counter?.data} title="The Islamic's Unique Visitors" />
      <CounterUp data={visitor?.data} title="The Islamic's Normal Visitors" />
    </div>
  );
}
