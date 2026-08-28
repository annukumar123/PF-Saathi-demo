export type Purpose = 'withdrawal'|'advance'|'transfer'|'pension'|'unsure';
export type Situation = 'left'|'changed'|'working'|'unavailable'|'medical'|'unsure';
export type Choice = 'yes'|'no'|'pending'|'unknown'|'na';
export type Status = 'PASS'|'REVIEW'|'ACTION_REQUIRED'|'NOT_APPLICABLE';
export type Check = { id:string; title:string; category:string; status:Status; severity:'LOW'|'MEDIUM'|'HIGH'; explanation:string; action:string; source:string; lastVerified:string };
export type Answers = { purpose:Purpose; situation:Situation; kyc:Choice; epfoName:string; aadhaarName:string; bank:Choice; exitDate:Choice; multipleUan:Choice; demo?:boolean };
