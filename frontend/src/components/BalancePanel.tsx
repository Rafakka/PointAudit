
import type { BalancedResult } from "@contracts"

type Props = {
    balance: BalancedResult
}

export default function BalancePanel ({balance}:Props) {
    return (
        <div className="balance-panel">
            <h3>Time Bank Summary</h3>
            <p>Total Worked:{balance.totalWorkingMinutes} min </p>
            <p>Total Required:{balance.totalRequiredMinutes} min </p>
            <p>Final Balance:<strong>{balance.formattedBalance}</strong></p>
        </div>
        
    )
}
