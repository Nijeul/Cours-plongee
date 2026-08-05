/**
 * Tests de l'algorithme de révision espacée SM-2 simplifié.
 */

import { describe, expect, it } from "vitest";
import { addDaysIso, dueCards, newCard, reviewCard } from "@/lib/calc/sm2";
import type { SrsCard } from "@/lib/types";

const TODAY = "2026-08-05";

function makeCard(overrides: Partial<SrsCard> = {}): SrsCard {
  return { ...newCard("n2-tables-001", "n2", "tables-deco", "n2-tables-mn90", TODAY), ...overrides };
}

describe("addDaysIso", () => {
  it("ajoute des jours en restant en date ISO", () => {
    expect(addDaysIso("2026-08-05", 1)).toBe("2026-08-06");
    expect(addDaysIso("2026-08-05", 35)).toBe("2026-09-09");
  });

  it("franchit les fins de mois et d'année", () => {
    expect(addDaysIso("2026-08-30", 7)).toBe("2026-09-06");
    expect(addDaysIso("2026-12-30", 3)).toBe("2027-01-02");
  });

  it("refuse un format de date invalide", () => {
    expect(() => addDaysIso("05/08/2026", 1)).toThrow(/Format attendu/);
  });
});

describe("newCard", () => {
  it("initialise la carte avec easiness 2,5 et une échéance à J+1", () => {
    const card = newCard("n1-phys-004", "n1", "physique", "n1-flottabilite-pression", TODAY);
    expect(card.questionId).toBe("n1-phys-004");
    expect(card.level).toBe("n1");
    expect(card.domain).toBe("physique");
    expect(card.moduleSlug).toBe("n1-flottabilite-pression");
    expect(card.easiness).toBe(2.5);
    expect(card.intervalDays).toBe(1);
    expect(card.repetitions).toBe(0);
    expect(card.lapses).toBe(0);
    expect(card.dueDate).toBe("2026-08-06");
    expect(card.createdAt).toBe(TODAY);
    expect(card.updatedAt).toBe(TODAY);
  });
});

describe("reviewCard — progression dans la grille [1, 3, 7, 16, 35]", () => {
  it("cinq succès « correct » suivent la grille, puis intervalle × easiness", () => {
    let card = makeCard();
    let day = TODAY;

    const expectedIntervals = [1, 3, 7, 16, 35];
    for (let i = 0; i < expectedIntervals.length; i++) {
      card = reviewCard(card, 2, day);
      expect(card.repetitions).toBe(i + 1);
      expect(card.intervalDays).toBe(expectedIntervals[i]);
      expect(card.easiness).toBe(2.5); // qualité 2 : easiness inchangé
      expect(card.dueDate).toBe(addDaysIso(day, expectedIntervals[i]));
      day = card.dueDate;
    }

    // 6e succès : au-delà de la grille → 35 × 2,5 = 87,5 → 88 jours.
    card = reviewCard(card, 2, day);
    expect(card.repetitions).toBe(6);
    expect(card.intervalDays).toBe(88);
    expect(card.dueDate).toBe(addDaysIso(day, 88));
  });

  it("la carte n'est jamais mutée : reviewCard retourne un nouvel objet", () => {
    const card = makeCard();
    const snapshot = { ...card };
    reviewCard(card, 2, TODAY);
    expect(card).toEqual(snapshot);
  });
});

describe("reviewCard — ajustements du facteur de facilité", () => {
  it("qualité 3 : + 0,1 avec plafond 2,8", () => {
    let card = makeCard();
    card = reviewCard(card, 3, TODAY);
    expect(card.easiness).toBe(2.6);
    card = reviewCard(card, 3, TODAY);
    expect(card.easiness).toBe(2.7);
    card = reviewCard(card, 3, TODAY);
    expect(card.easiness).toBe(2.8);
    card = reviewCard(card, 3, TODAY);
    expect(card.easiness).toBe(2.8); // plafond
  });

  it("qualité 1 : − 0,15 avec plancher 1,3, mais compte comme un succès", () => {
    let card = makeCard();
    card = reviewCard(card, 1, TODAY);
    expect(card.easiness).toBe(2.35);
    expect(card.repetitions).toBe(1);
    expect(card.intervalDays).toBe(1);
    expect(card.lapses).toBe(0);
  });

  it("le plancher 1,3 est respecté après de nombreuses réponses difficiles", () => {
    let card = makeCard();
    for (let i = 0; i < 12; i++) {
      card = reviewCard(card, 1, TODAY);
    }
    expect(card.easiness).toBe(1.3);
  });
});

describe("reviewCard — échec (qualité 0)", () => {
  it("réinitialise les répétitions, incrémente lapses, réduit easiness, échéance J+1", () => {
    let card = makeCard();
    card = reviewCard(card, 2, TODAY); // rep 1
    card = reviewCard(card, 2, TODAY); // rep 2
    card = reviewCard(card, 2, TODAY); // rep 3

    const failed = reviewCard(card, 0, "2026-08-20");
    expect(failed.repetitions).toBe(0);
    expect(failed.lapses).toBe(1);
    expect(failed.easiness).toBe(2.3); // 2,5 − 0,2
    expect(failed.intervalDays).toBe(1);
    expect(failed.dueDate).toBe("2026-08-21");
    expect(failed.updatedAt).toBe("2026-08-20");
  });

  it("après un échec, la progression repart au début de la grille", () => {
    let card = makeCard();
    card = reviewCard(card, 2, TODAY);
    card = reviewCard(card, 2, TODAY);
    card = reviewCard(card, 0, TODAY); // échec
    card = reviewCard(card, 2, TODAY); // repart à rep 1
    expect(card.repetitions).toBe(1);
    expect(card.intervalDays).toBe(1);
  });

  it("le plancher easiness 1,3 est respecté après des échecs répétés", () => {
    let card = makeCard({ easiness: 1.35 });
    card = reviewCard(card, 0, TODAY);
    expect(card.easiness).toBe(1.3);
    card = reviewCard(card, 0, TODAY);
    expect(card.easiness).toBe(1.3);
    expect(card.lapses).toBe(2);
  });
});

describe("reviewCard — validation", () => {
  it("refuse une date mal formée", () => {
    expect(() => reviewCard(makeCard(), 2, "5 août 2026")).toThrow(/Format attendu/);
  });
});

describe("dueCards", () => {
  it("retourne les cartes échues (dueDate ≤ aujourd'hui) triées par échéance", () => {
    const late = makeCard({ id: "srs-b", dueDate: "2026-08-01" });
    const today = makeCard({ id: "srs-c", dueDate: "2026-08-05" });
    const future = makeCard({ id: "srs-a", dueDate: "2026-08-09" });
    const veryLate = makeCard({ id: "srs-d", dueDate: "2026-07-20" });

    const due = dueCards([late, today, future, veryLate], TODAY);
    expect(due.map((c) => c.id)).toEqual(["srs-d", "srs-b", "srs-c"]);
  });

  it("trie de façon stable par identifiant à échéance égale", () => {
    const a = makeCard({ id: "srs-a", dueDate: "2026-08-01" });
    const b = makeCard({ id: "srs-b", dueDate: "2026-08-01" });
    const due = dueCards([b, a], TODAY);
    expect(due.map((c) => c.id)).toEqual(["srs-a", "srs-b"]);
  });

  it("retourne un tableau vide si rien n'est échu", () => {
    const future = makeCard({ dueDate: "2026-09-01" });
    expect(dueCards([future], TODAY)).toEqual([]);
  });
});
