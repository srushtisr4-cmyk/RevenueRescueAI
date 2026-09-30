import {
  calculatePriorityScore,
  getPriorityLevel
} from "./priorityService.js";

const testData = {
  lead_score: 82.5,
  deal_value: 2500000,
  probability: 75,
  deal_stage: "Proposal"
};

const score = calculatePriorityScore(testData);
const level = getPriorityLevel(score);

console.log("Priority Score:", score);
console.log("Priority Level:", level);