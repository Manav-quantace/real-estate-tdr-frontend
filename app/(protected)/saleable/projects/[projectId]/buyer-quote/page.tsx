import BuyerQuoteForm from "./BuyerQuoteForm";
import RoundHistory from "./RoundHistory";

export default async function BuyerQuotePage({
    params,
}: {
    params: Promise<{ projectId: string }>;
}) {
    const { projectId } = await params;

    return (
        <div className="p-6">
            <BuyerQuoteForm projectId={projectId} />
            <RoundHistory projectId={projectId} />
        </div>
    );
}
