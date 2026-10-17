"use client";

import dynamic from "next/dynamic";

export const SceneLazy = dynamic(() => import("./Scene"), {
  ssr: false,
});
