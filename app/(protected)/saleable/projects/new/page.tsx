import SaleableCreateClient from "./SaleableCreateClient";

export default function NewSaleableProjectPage() {
    return (
        <div className="mx-auto max-w-3xl p-6 space-y-4">
            <h1 className="text-2xl font-semibold">
                Create saleable redevelopment project
            </h1>

            <SaleableCreateClient />
        </div>
    );
}
