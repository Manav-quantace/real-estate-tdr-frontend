type Props = {
    r: any;
};

export default function DwellerResolutionRow({ r }: Props) {
    return (
        <tr className="border-t">
            <td className="p-2 text-xs font-mono">{r.slum_dweller_id}</td>

            <td className="p-2 text-xs font-mono">
                {r.preference_submitted ? "true" : "false"}
            </td>

            <td className="p-2 text-xs">
                {r.preference ? (
                    <>
                        <div className="font-mono">
                            rehab_option={r.preference.rehab_option}
                        </div>
                        <div className="font-mono">
                            floor_pref={r.preference.floor_preference}
                        </div>
                    </>
                ) : (
                    "—"
                )}
            </td>

            <td className="p-2 text-xs">
                {r.allocation ? (
                    <>
                        <div className="font-mono">{r.allocation.unit_label}</div>
                        <div className="font-mono">floor={r.allocation.floor}</div>
                        <div className="font-mono">status={r.allocation.status}</div>
                    </>
                ) : (
                    "—"
                )}
            </td>

            <td className="p-2 text-xs text-slate-600">{r.notes ?? ""}</td>
        </tr>
    );
}
