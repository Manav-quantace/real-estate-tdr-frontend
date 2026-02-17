import { cookies } from "next/headers";
import MatchingResultCard from "@/app/(protected)/authority/components/MatchingResultCard";
import SettlementResultCard from "@/app/(protected)/authority/components/SettlementResultCard";
import LedgerCard from "@/app/(protected)/authority/components/LedgerCard";
import ContractCard from "@/app/(protected)/authority/components/ContractCard";
import { ProjectStatusCard } from "@/app/(protected)/authority/components/ProjectStatusCard";
import { SettlementDiagnosticsCard } from "@/app/(protected)/authority/components/SettlementDiagnosticCard";
import { ResultsClientWrapper } from "./client-wrapper";

type ResultsData = {
    projectStatus: any;
    matching: any;
    settlement: any;
    contracts: any[];
    ledger: any[];
    ledgerVerify: any;
    diagnostics: any;
};

async function fetchResultsData(
    projectId: string,
    workflow: string,
    round: number,
    authCookie: string
): Promise<ResultsData> {
    const [
        matchingRes,
        settlementRes,
        ledgerRes,
        ledgerVerifyRes,
        contractRes,
        diagnosticsRes,
    ] = await Promise.all([
        fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/matching/result?workflow=${workflow}&projectId=${projectId}&t=${round}`,
            { headers: { cookie: authCookie }, cache: "no-store" }
        ),
        fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/settlement/result?workflow=${workflow}&projectId=${projectId}&t=${round}`,
            { headers: { cookie: authCookie }, cache: "no-store" }
        ),
        fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/ledger?workflow=${workflow}&projectId=${projectId}`,
            { headers: { cookie: authCookie }, cache: "no-store" }
        ),
        fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/ledger/verify?workflow=${workflow}&projectId=${projectId}`,
            { headers: { cookie: authCookie }, cache: "no-store" }
        ),
        fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/contracts/byProject?workflow=${workflow}&projectId=${projectId}`,
            { headers: { cookie: authCookie }, cache: "no-store" }
        ),
        fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/authority/settlement/diagnostics?workflow=${workflow}&projectId=${projectId}&t=${round}`,
            { headers: { cookie: authCookie }, cache: "no-store" }
        ),
    ]);

    const matching = matchingRes.ok ? await matchingRes.json() : null;
    const settlement = settlementRes.ok ? await settlementRes.json() : null;
    const ledger = ledgerRes.ok ? await ledgerRes.json() : [];
    const ledgerVerify = ledgerVerifyRes.ok ? await ledgerVerifyRes.json() : null;
    const contracts = contractRes.ok ? (await contractRes.json()).contracts ?? [] : [];
    const diagnostics = diagnosticsRes.ok ? await diagnosticsRes.json() : null;

    const settlementString = settlement
        ? settlement.settled
            ? "settled"
            : "computed"
        : "not_computed";

    const projectStatus = {
        round,
        settlement: settlementString,
        contractExists: contracts.length > 0,
        ledgerEntries: Array.isArray(ledger) ? ledger.length : 0,
        chainValid: !!ledgerVerify?.valid,
    };

    return {
        projectStatus,
        matching,
        settlement,
        contracts,
        ledger,
        ledgerVerify,
        diagnostics,
    };
}

type Props = {
    params: Promise<{ projectId: string }>;
    searchParams: Promise<{ workflow?: string; t?: string }>;
};

export default async function AuthorityResultsPage({
    params,
    searchParams,
}: Props) {
    const { projectId } = await params;
    const { workflow = "saleable", t = "0" } = await searchParams;

    const cookieStore = await cookies();
    const authCookie = cookieStore.toString();

    const data = await fetchResultsData(
        projectId,
        workflow,
        Number(t),
        authCookie
    );

    return (
        <ResultsClientWrapper
            projectId={projectId}
            workflow={workflow}
            initialRound={Number(t)}
            initialData={data}
        />
    );
}
