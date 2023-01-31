function getMedalForScore(score: number, difficultyId: number) {
  const scores = {
    1: {
      perfect: 100000,
      diamond: 0,
      platinum: 98000,
      gold: 97000,
    },
    3: {
      perfect: 75000,
      diamond: 74250,
      platinum: 73500,
      gold: 72750,
    },
    4: {
      perfect: 50000,
      diamond: 49500,
      platinum: 49000,
      gold: 48500,
    },
    5: {
      perfect: 25000,
      diamond: 24800,
      platinum: 24500,
      gold: 24250,
    },
  };

  if (difficultyId < 1 || difficultyId > 5 || difficultyId === 2) {
    return "";
  }

  const relevantScores = scores[difficultyId];
  if (score === relevantScores.perfect) {
    console.log("ret perf");
    return "perfect";
  } else if (score >= relevantScores.diamond) {
    return "diamond";
  } else if (score >= relevantScores.platinum) {
    return "platinum";
  } else if (score >= relevantScores.gold) {
    return "gold";
  } else {
    return "";
  }
}

export { getMedalForScore };
