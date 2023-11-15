

const evaluteHand = (cards: Card[]): Combination[] => {
    const combinations: Combination[] = [];
    if(isRoyalFlush(cards)) combinations.push(Combination.RoyalFlush);
    if(isStraightFlush(cards)) combinations.push(Combination.StraightFlush);
    if(isFourOfAKind(cards)) combinations.push(Combination.FourOfAKind);
    return combinations;
}





/**
 * @param cards sorted by value
 */
const isRoyalFlush = (cards: Card[]): boolean => {
    const royalValues: Value[] = [Value.Ten, Value.Jack, Value.Queen, Value.King, Value.Ace];
    const royalFlushColor = cards[0].color; // Assuming the cards are sorted by value

    for (let i = 0; i < royalValues.length; i++) {
        if (cards[i].value !== royalValues[i] || cards[i].color !== royalFlushColor) {
            return false;
        }
    }
    return true;
}

const isStraightFlush=(cards: Card[]): boolean => {
    const flushColor = cards[0].color; // Assuming the cards are sorted by value

    // Vérifier si toutes les cartes ont la même couleur (flush)
    if (cards.every(card => card.color === flushColor)) {
        // Vérifier si les valeurs sont consécutives
        for (let i = 0; i < cards.length - 1; i++) {
            const currentValue = cards[i].value;
            const nextValue = cards[i + 1].value;

            if (currentValue !== nextValue - 1) {
                return false;
            }
        }

        return true;
    }

    return false;
}

const isFourOfAKind = (cards: Card[]): boolean => {
        for (let i = 0; i < cards.length - 1; i++) {
            const currentValue = cards[i].value;
            const nextValue = cards[i + 1].value;

            if (currentValue !== nextValue - 1) {
                return false;
            }
        }
    return true;
}
