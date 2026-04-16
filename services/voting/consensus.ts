// services/voting/consensus.ts
export type VotingStrategy = 'plurality' | 'softmax_weighted';

export interface Candidate<T> {
  item: T;
  score?: number;
}

export function vote<T>(candidates: Candidate<T>[], strategy: VotingStrategy = 'plurality'): T {
  if (candidates.length === 0) throw new Error('No candidates to vote on');

  if (strategy === 'plurality') {
    const withScore = candidates.map((c, i) => ({ ...c, score: c.score ?? 0, idx: i }));
    withScore.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    return withScore[0].item;
  }

  if (strategy === 'softmax_weighted') {
    const scores = candidates.map(c => c.score ?? 0);
    const max = Math.max(...scores);
    const exps = scores.map(s => Math.exp(s - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    const probs = exps.map(e => e / sum);
    const r = Math.random();
    let cum = 0;
    for (let i = 0; i < candidates.length; i++) {
      cum += probs[i];
      if (r <= cum) return candidates[i].item;
    }
    return candidates[candidates.length - 1].item;
  }

  return candidates[0].item;
}