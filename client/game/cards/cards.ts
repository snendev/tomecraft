export type CardKey =
  | 'cl_2'
  | 'cl_3'
  | 'cl_4'
  | 'cl_5'
  | 'cl_6'
  | 'cl_7'
  | 'cl_8'
  // | 'cl_9'
  // | 'cl_10'
  // | 'cl_11'
  // | 'cl_12'
  // | 'cl_13'
  | 'cl_14'
  | 'di_2'
  | 'di_3'
  | 'di_4'
  | 'di_5'
  | 'di_6'
  | 'di_7'
  | 'di_8'
  // | 'di_9'
  // | 'di_10'
  // | 'di_11'
  // | 'di_12'
  // | 'di_13'
  | 'di_14'
  // | 'hr_2'
  // | 'hr_3'
  // | 'hr_4'
  // | 'hr_5'
  // | 'hr_6'
  // | 'hr_7'
  // | 'hr_8'
  // | 'hr_9'
  // | 'hr_10'
  // | 'hr_11'
  // | 'hr_12'
  // | 'hr_13'
  // | 'hr_14'
  | 'sp_2'
  | 'sp_3'
  | 'sp_4'
  | 'sp_5'
  | 'sp_6'
  | 'sp_7'
  | 'sp_8'
  // | 'sp_9'
  // | 'sp_10'
  // | 'sp_11'
  // | 'sp_12'
  // | 'sp_13'
  | 'sp_14'

const cardPaths: Record<CardKey, string> = {
  cl_2: 'cl_2.png',
  cl_3: 'cl_3.png',
  cl_4: 'cl_4.png',
  cl_5: 'cl_5.png',
  cl_6: 'cl_6.png',
  cl_7: 'cl_7.png',
  cl_8: 'cl_8.png',
  // cl_9: 'cl_9.png',
  // cl_10: 'cl_10.png',
  // cl_11: 'cl_11.png',
  // cl_12: 'cl_12.png',
  // cl_13: 'cl_13.png',
  cl_14: 'cl_14.png',
  di_2: 'di_2.png',
  di_3: 'di_3.png',
  di_4: 'di_4.png',
  di_5: 'di_5.png',
  di_6: 'di_6.png',
  di_7: 'di_7.png',
  di_8: 'di_8.png',
  // di_9: 'di_9.png',
  // di_10: 'di_10.png',
  // di_11: 'di_11.png',
  // di_12: 'di_12.png',
  // di_13: 'di_13.png',
  di_14: 'di_14.png',
  // hr_2: 'hr_2.png',
  // hr_3: 'hr_3.png',
  // hr_4: 'hr_4.png',
  // hr_5: 'hr_5.png',
  // hr_6: 'hr_6.png',
  // hr_7: 'hr_7.png',
  // hr_8: 'hr_8.png',
  // hr_9: 'hr_9.png',
  // hr_10: 'hr_10.png',
  // hr_11: 'hr_11.png',
  // hr_12: 'hr_12.png',
  // hr_13: 'hr_13.png',
  // hr_14: 'hr_14.png',
  sp_2: 'sp_2.png',
  sp_3: 'sp_3.png',
  sp_4: 'sp_4.png',
  sp_5: 'sp_5.png',
  sp_6: 'sp_6.png',
  sp_7: 'sp_7.png',
  sp_8: 'sp_8.png',
  // sp_9: 'sp_9.png',
  // sp_10: 'sp_10.png',
  // sp_11: 'sp_11.png',
  // sp_12: 'sp_12.png',
  // sp_13: 'sp_13.png',
  sp_14: 'sp_14.png',
}

export function getCardSrc(cardKey: CardKey): string {
  return `/assets/${cardPaths[cardKey]}`
}
