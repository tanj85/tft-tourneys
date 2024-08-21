"use client";

import type { ReactNode } from "react";

export const LiveWrapper = ({ slot }: { slot: ReactNode }) => {
  return <>{slot}</>;
};
