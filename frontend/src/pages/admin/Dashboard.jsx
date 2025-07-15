import CounterUp from "@/components/common/CounterUp";

import { useVisitorQuery, useCounterQuery } from "@/slices/utils";

export default function Dashboard() {
  const { data: visitor } = useVisitorQuery();
  const { data: counter } = useCounterQuery();

  return (
    <div className="bg-primary-foreground p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <CounterUp data={counter?.data} title="The Islamic's Unique Visitors" />
        <CounterUp data={visitor?.data} title="The Islamic's Normal Visitors" />
      </div>
    </div>
  );
}
