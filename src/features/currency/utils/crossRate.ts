import { SPREAD } from './constants';



function calculateCrossRate(amount: number, rateForm: number, rateTo: number): number { return (amount * rateTo) / rateForm; }

function applyBuySpread(rate: number, spread: number = SPREAD): number { return rate * (1 + spread); }
function applySellSpread(rate: number, spread: number = SPREAD): number { return rate * (1 - spread); }



export { calculateCrossRate, applyBuySpread, applySellSpread };