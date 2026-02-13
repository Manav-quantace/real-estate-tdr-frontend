import { FC } from 'react'

interface RoundStatusBannerProps {
    round: any
}

const RoundStatusBanner: FC<RoundStatusBannerProps> = ({ round }) => {
    if (!round) {
        return <div className="text-sm text-muted-foreground">No active round</div>
    }

    if (round.is_locked) {
        return <div className="text-sm text-red-600">Round is locked. Bidding closed.</div>
    }

    if (!round.is_open) {
        return <div className="text-sm text-yellow-600">Round is not open yet.</div>
    }

    return <div className="text-sm text-green-600">Round is open for bidding</div>
}

export default RoundStatusBanner
