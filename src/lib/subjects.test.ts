import test from "node:test";
import assert from "node:assert/strict";

import { SUBJECTS, buildModuleNarrative } from "./subjects";

test("buildModuleNarrative returns concrete module guidance for API and database topics", () => {
  const subject = SUBJECTS.find((item) => item.slug === "programmieren-python");
  assert.ok(subject, "Python subject should exist");
  assert.ok(subject.modules && subject.modules.length > 0, "Python subject should have modules");

  const apiLikeModule = {
    code: "API-01",
    year: "2./3. Lehrjahr",
    title: "APIs & Datenbanken",
    focus: "Daten zwischen Frontend und Server sicher austauschen.",
    summary: "In diesem Modul lernst du, wie Anwendungen Daten austauschen, abrufen und speichern.",
    learningGoals: ["API-Endpunkte verstehen", "Datenbankabfragen lesen"],
    practicalExamples: ["Ein Bestellformular mit Datenbank speichern", "Ein Produkt aus der API anzeigen"],
  };

  const narrative = buildModuleNarrative(apiLikeModule);

  assert.match(narrative.baseSummary.toLowerCase(), /api|datenbank|daten/i);
  assert.ok(narrative.prerequisites.some((item) => item.toLowerCase().includes("daten") || item.toLowerCase().includes("api")));
  assert.ok(narrative.bestWayToLearn.some((item) => item.toLowerCase().includes("beispiel") || item.toLowerCase().includes("fragen")));
  assert.ok(narrative.support.some((item) => item.toLowerCase().includes("api") || item.toLowerCase().includes("datenbank") || item.toLowerCase().includes("aufgaben")));
});
