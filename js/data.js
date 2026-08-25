const WORD_DATABASE = {
    easy: {
        lanes: 3,
        speed: 1.5,
        spawnInterval: 1800,
        positiveRatio: 0.9, // 90% positive
        words: [
            { text: "Respect", type: "positive" },
            { text: "Kindness", type: "positive" },
            { text: "Empathy", type: "positive" },
            { text: "Listening", type: "positive" },
            { text: "Sharing", type: "positive" },
            { text: "Helpful", type: "positive" },
            { text: "Fairness", type: "positive" },
            { text: "Inclusion", type: "positive" },
            { text: "Rude", type: "negative" }
        ]
    },
    medium: {
        lanes: 4,
        speed: 2.2,
        spawnInterval: 1400,
        positiveRatio: 0.8, // 80% positive
        words: [
            { text: "Respect", type: "positive" },
            { text: "Compassion", type: "positive" },
            { text: "Patience", type: "positive" },
            { text: "Gratitude", type: "positive" },
            { text: "Teamwork", type: "positive" },
            { text: "Integrity", type: "positive" },
            { text: "Bullying", type: "negative" },
            { text: "Insult", type: "negative" },
            { text: "Selfish", type: "negative" }
        ]
    },
    hard: {
        lanes: 4,
        speed: 3.0,
        spawnInterval: 1000,
        positiveRatio: 0.7, // 70% positive
        words: [
            { text: "Dignity", type: "positive" },
            { text: "Courage", type: "positive" },
            { text: "Altruism", type: "positive" },
            { text: "Collaboration", type: "positive" },
            { text: "Bullying", type: "negative" },
            { text: "Arrogant", type: "negative" },
            { text: "Exclusion", type: "negative" },
            { text: "Hostility", type: "negative" },
            { text: "Jealousy", type: "negative" }
        ]
    }
};