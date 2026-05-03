"use client";

import { useMemo, useState } from "react";
import { Status } from "@prisma/client";
import { ModuleList } from "@/components/dashboard/ModuleList";
import { ProgressBar } from "@/components/dashboard/ProgressBar";

type ModuleWithProgress = {
  id: string;
  title: string;
  description: string;
  orderIndex: number;
  progressStatus: Status;
};

export function ModuleProgressClient({
  initialModules,
}: {
  initialModules: ModuleWithProgress[];
}) {
  const [modules, setModules] = useState(initialModules);

  const completedModules = useMemo(
    () =>
      modules.filter((module) => module.progressStatus === Status.COMPLETED)
        .length,
    [modules]
  );

  return (
    <>
      <ProgressBar total={modules.length} completed={completedModules} />
      <ModuleList modules={modules} onModulesChange={setModules} />
    </>
  );
}
