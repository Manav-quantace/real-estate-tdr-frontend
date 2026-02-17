"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import MatchingResultCard from "@/app/(protected)/authority/components/MatchingResultCard";
import SettlementResultCard from "@/app/(protected)/authority/components/SettlementResultCard";
import LedgerCard from "@/app/(protected)/authority/components/LedgerCard";
import ContractCard from "@/app/(protected)/authority/components/ContractCard";
import { ProjectStatusCard } from "@/app/(protected)/authority/components/ProjectStatusCard";
import { SettlementDiagnosticsCard } from "@/app/(protected)/authority/components/SettlementDiagnosticCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ResultsData = {
    projectStatus: any;
    matching: any;
    settlement: any;
    contracts: any[];
    ledger: any[];
    ledgerVerify: any;
    diagnostics: any;
};

export function ResultsClientWrapper({
    projectId,
    workflow,
    initialRound,
    initialData,
}: {
    projectId: string;
    workflow: string;
    initialRound: number;
    initialData: ResultsData;
}) {
    const router = useRouter();
    const [round, setRound] = useState<number>(initialRound);
    const [isLoading, setIsLoading] = useState(false);

    // NOTE: fixed route — include projectId & correct path so navigation goes to the server page that renders results.
    const navigateToRound = useCallback(
        async (newRound: number) => {
            if (newRound < 0) return;
            setRound(newRound);
            setIsLoading(true);
            const url = `/authority/projects/${projectId}/result?workflow=${workflow}&t=${newRound}`;
            try {
                // await to ensure we show loading state while navigation happens
                await router.push(url);
            } finally {
                // once navigation is triggered, this component will likely unmount,
                // but keep defensive reset for the cases where push resolves without full nav.
                setIsLoading(false);
            }
        },
        [router, workflow, projectId]
    );

    const handlePrevious = () => navigateToRound(round - 1);
    const handleNext = () => navigateToRound(round + 1);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950">
            {/* Header */}
            <div className="sticky top-0 z-50 border-b border-blue-200/50 dark:border-blue-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex flex-col gap-4">
                            {/* Title */}
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg">A</span>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                                        Authority Results
                                    </h1>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                        {projectId} • {workflow}
                                    </p>
                                </div>
                            </div>

                            {/* Round Controls */}
                            <div className="flex items-center gap-2 bg-linear-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-800 p-4 rounded-lg border border-blue-200/50 dark:border-blue-800/30 backdrop-blur-sm">
                                <Button
                                    onClick={handlePrevious}
                                    disabled={round === 0 || isLoading}
                                    variant="outline"
                                    size="sm"
                                    className="border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition-all duration-200 bg-transparent"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>

                                <div className="flex-1 flex items-center gap-3">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                        Round
                                    </label>

                                    {/* update local round on input change; navigation happens on Enter or via buttons */}
                                    <input
                                        type="number"
                                        value={round}
                                        onChange={(e) => {
                                            const v = Number(e.target.value);
                                            setRound(Number.isNaN(v) ? 0 : v);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                navigateToRound(Number(round));
                                            }
                                        }}
                                        min="0"
                                        disabled={isLoading}
                                        className="w-20 px-3 py-2 text-center font-bold text-lg text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 border-2 border-blue-300 dark:border-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                                    />
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                        of {Math.max(round, 0)}
                                    </span>
                                </div>

                                <Button
                                    onClick={handleNext}
                                    disabled={isLoading}
                                    variant="outline"
                                    size="sm"
                                    className="border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition-all duration-200 bg-transparent"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>

                                {isLoading && (
                                    <div className="flex items-center gap-2 ml-2 text-blue-600 dark:text-blue-400">
                                        <div className="w-4 h-4 rounded-full border-2 border-blue-300 border-t-blue-600 dark:border-blue-700 dark:border-t-blue-400 animate-spin" />
                                        <span className="text-xs font-medium">Loading...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-4">
                    {/* Project Status - Featured */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
                        <div className="relative">
                            <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-cyan-400 rounded-lg blur opacity-10" />
                            <div className="relative">
                                <ProjectStatusCard status={initialData.projectStatus} />
                            </div>
                        </div>
                    </div>

                    {/* Grid Layout for Results */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {initialData.matching && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out [animation-delay:100ms]">
                                <MatchingResultCard data={initialData.matching} />
                            </div>
                        )}
                        {initialData.settlement && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out [animation-delay:200ms]">
                                <SettlementResultCard data={initialData.settlement} />
                            </div>
                        )}
                    </div>

                    {/* Full Width Cards */}
                    <div className="space-y-4">
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out [animation-delay:300ms]">
                            <ContractCard contracts={initialData.contracts} />
                        </div>
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out [animation-delay:400ms]">
                            <LedgerCard
                                entries={initialData.ledger}
                                verify={initialData.ledgerVerify}
                            />
                        </div>
                        {initialData.diagnostics && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out [animation-delay:500ms]">
                                <SettlementDiagnosticsCard data={initialData.diagnostics} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
