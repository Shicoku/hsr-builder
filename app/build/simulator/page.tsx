import { Suspense } from "react";
import SimulatorView from "./simulatorView";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SimulatorView />
    </Suspense>
  );
}
