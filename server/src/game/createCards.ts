import { Card, Color, PlayerType, Value } from "../../../shared/types/types";
import { isNumber } from "../utils/isNumber";

const colors: Color[] = ["red", "green", "blue", "yellow"];
const numbers: Value[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const actions: Value[] = ["skip", "reverse", "draw-two"];
const wilds: Value[] = ["wild", "wild-draw-four"];

// Create a full UNO deck with correct card counts

function generateDeck(): Card[] {
  const deck: Card[] = [];
  let id = 0;

  // Numbered cards
  colors.forEach((color) => {
    numbers.forEach((num) => {
      deck.push({ id: id++, color, value: num }); // one 0 per color
      if (num !== "0") deck.push({ id: id++, color, value: num }); // two of 1-9
    });

    // Action cards (2 each per color)
    actions.forEach((action) => {
      deck.push({ id: id++, color, value: action });
      deck.push({ id: id++, color, value: action });
    });
  });

  // Wild cards (4 each)
  wilds.forEach((wild) => {
    for (let i = 0; i < 4; i++) {
      deck.push({ id: id++, color: "black", value: wild });
    }
  });

  return deck;
}

// Shuffle array
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Create drawPile and hands
export function createCards(players: PlayerType[]): {
  drawPile: Card[];
  updatedPlayers: PlayerType[];
  startingCard: Card;
} {
  let deck = shuffle(generateDeck());
  const updatedPlayers = players.map((player) => {
    const hand = deck.splice(0, 7); // 7 cards each
    return { ...player, hand };
  });

  let startingCard: Card | undefined = undefined;

  do {
    startingCard = deck.shift() as Card;
    const value = startingCard.value;
    const isNum = isNumber(value);
    if (!isNum) {
      deck.push(startingCard);
      startingCard = undefined;
    }
  } while (!startingCard);

  return { drawPile: deck, updatedPlayers, startingCard };
}
