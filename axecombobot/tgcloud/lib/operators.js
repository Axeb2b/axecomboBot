export const OPERATORS = [
  ['8528','HFCL'],['8591','RELIANCE'],['9780','VODAFONE'],['9814','IDEA'],['9872','AIRTEL'],
  ['9876','AIRTEL'],['9988','VODAFONE'],['8054','VODAFONE'],['8427','AIRTEL'],['9501','AIRTEL'],
  ['9357','Reliance Comm. CDMA'],['9464','BSNL CellOne GSM'],['9417','BSNL CellOne GSM'],['9463','BSNL CellOne GSM'],
  ['9316','Reliance Comm. CDMA'],['9803','DATACOM / Videocon'],['9878','AIRTEL'],['9914','IDEA'],['8437','IDEA'],
  ['9217','Tata Indicom CDMA'],['9256','Tata Indicom CDMA'],['9356','Reliance Comm. CDMA'],['9465','BSNL CellOne GSM'],
  ['9478','BSNL CellOne GSM'],['7508','VODAFONE'],['9317','Reliance Comm. CDMA'],['7307','RL'],['8968','AIRTEL'],
  ['7355','Videocon Telecom'],['7380','BSNL'],['7589','CellOne GSM / BSNL'],['7814','Reliance CDMA'],['7837','VODAFONE'],
  ['9781','IDEA'],['9592','IDEA'],['9855','IDEA'],['9653','PING CDMA / HFCL Infotel'],['9877','PING CDMA / HFCL Infotel'],
  ['9569','Reliance GSM'],['9216','Tata Indicom CDMA'],['9257','Tata Indicom CDMA'],['8872','IDEA'],['9779','AIRTEL'],
  ['9815','AIRTEL'],['9915','AIRTEL'],['8699','TATA DOCOMO'],['7696','TATA DOCOMO'],['8146','AIRTEL'],['9646','VODAFONE'],
  ['8992','CellOne GSM / BSNL'],['9888','VODAFONE'],['9517','ETISALAT / Cheers Mobile'],
];
export const JIO = ['60090','60091','60092','70050','70051','70052','70060','70061','70070','70080','70090'];
export const AIRTEL = ['70020','70021','70050','70850','70860','70870','70880','70930','70950','70960'];
export const VI = ['90890','90891','98620','98621','70050','70060'];
export const BSNL = ['69090','69091','94020','94360','94361','94362','94363','94364','94365'];
export function allLabels() {
  const m = new Map();
  for (const [c,l] of OPERATORS) m.set(c,l);
  for (const c of JIO) m.set(c,'Jio');
  for (const c of AIRTEL) m.set(c,'Airtel');
  for (const c of VI) m.set(c,'Vi (Vodafone Idea)');
  for (const c of BSNL) m.set(c,'BSNL');
  return m;
}
