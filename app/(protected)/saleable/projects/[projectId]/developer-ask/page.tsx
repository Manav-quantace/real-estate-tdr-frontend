'use client';

import { useParams } from "next/navigation";
import DeveloperAskForm from "./DeveloperAskForm";

export default function DeveloperAskPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Developer Ask Submission</h1>
      <DeveloperAskForm projectId={projectId} />
    </div>
  );
}
