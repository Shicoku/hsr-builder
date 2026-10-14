import type { ReactNode } from "react";
import { BuildProvider } from "./buildContext";

export default function BuildLayout({ children }: { children: ReactNode }) {
  return <BuildProvider>{children}</BuildProvider>;
}
