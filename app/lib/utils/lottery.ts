/**
 * ゲーム結果を確率に基づいて抽選するロジック
 * @returns 抽選結果ID (1-20)
 */
export function determineResult(): number {
  // 20種類の結果、それぞれに異なる確率
  const results = [
    { id: 1, probability: 0.01 },  // 1% - 大当たり
    { id: 2, probability: 0.02 },  // 2%
    { id: 3, probability: 0.03 },  // 3%
    { id: 4, probability: 0.04 },  // 4%
    { id: 5, probability: 0.05 },  // 5%
    { id: 6, probability: 0.05 },  // 5%
    { id: 7, probability: 0.05 },  // 5%
    { id: 8, probability: 0.05 },  // 5%
    { id: 9, probability: 0.05 },  // 5%
    { id: 10, probability: 0.05 }, // 5%
    { id: 11, probability: 0.05 }, // 5%
    { id: 12, probability: 0.05 }, // 5%
    { id: 13, probability: 0.05 }, // 5%
    { id: 14, probability: 0.05 }, // 5%
    { id: 15, probability: 0.05 }, // 5%
    { id: 16, probability: 0.05 }, // 5%
    { id: 17, probability: 0.05 }, // 5%
    { id: 18, probability: 0.05 }, // 5%
    { id: 19, probability: 0.05 }, // 5%
    { id: 20, probability: 0.20 }, // 20% - 最も一般的な結果
  ];
  
  // 確率の合計が1になるように正規化
  const totalProbability = results.reduce((sum, result) => sum + result.probability, 0);
  const normalizedResults = results.map(result => ({
    ...result,
    probability: result.probability / totalProbability
  }));
  
  // 乱数生成と結果決定
  const random = Math.random();
  let cumulativeProbability = 0;
  
  for (const result of normalizedResults) {
    cumulativeProbability += result.probability;
    if (random <= cumulativeProbability) {
      return result.id;
    }
  }
  
  // 万が一の場合のフォールバック
  return normalizedResults[normalizedResults.length - 1].id;
}