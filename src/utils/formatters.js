export function formatNaira(amount) {
  if (amount === undefined || amount === null) return '₦0';
  return '₦' + Number(amount).toLocaleString('en-NG');
}

export function formatNairaCompact(amount) {
  if (amount >= 1000000) {
    const val = (amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 1);
    return `₦${val}M`;
  }
  if (amount >= 1000) {
    const val = (amount / 1000).toFixed(0);
    return `₦${val}k`;
  }
  return `₦${amount}`;
}

export function calculateTraditionalCosts(annualRent) {
  const agencyFee = annualRent * 0.10; // 10% traditional agent cut
  const legalFee = annualRent * 0.10;  // 10% traditional agreement cut
  const inspectionFees = 20000;         // ~₦5,000 x 4 trips wasted with street agents
  const totalWastedFees = agencyFee + legalFee + inspectionFees;
  
  // RentBridge direct costs
  const rentBridgePlatformFee = Math.min(25000, annualRent * 0.015); // flat modest convenience fee or 1.5% max
  const rentBridgeInspectionFee = 0; // Always 100% free

  const totalSaved = totalWastedFees - rentBridgePlatformFee;

  return {
    traditionalAgencyFee: agencyFee,
    traditionalLegalFee: legalFee,
    traditionalInspectionFees: inspectionFees,
    traditionalTotalOverhead: totalWastedFees,
    rentBridgeFee: rentBridgePlatformFee,
    totalSaved: Math.max(0, totalSaved)
  };
}

