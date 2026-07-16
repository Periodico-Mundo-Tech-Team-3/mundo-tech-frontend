import { describe } from "vitest";
import { formatDate } from "../src/utils/formatDate";

describe("formatDate", () => {
  it("should format a valid ISO date in Spanish format", () => {
    const date = new Date(2026, 6, 15);
    expect(formatDate(date.toISOString())).toBe("15 Jul 2026");
  });

  it("should format January correctly", () => {
    const date = new Date(2026, 0, 1);
    expect(formatDate(date.toISOString())).toBe("01 Ene 2026");
  });

  it("should format December correctly", () => {
    const date = new Date(2026, 11, 25);
    expect(formatDate(date.toISOString())).toBe("25 Dic 2026");
  });

  it("should pad single digit days with zero", () => {
    const date = new Date(2026, 2, 5);
    expect(formatDate(date.toISOString())).toBe("05 Mar 2026");
  });

  it("should return empty string for null", () => {
    expect(formatDate(null)).toBe("");
  });

  it("should return empty string for undefined", () => {
    expect(formatDate(undefined)).toBe("");
  });

  it("should return empty string for empty string", () => {
    expect(formatDate("")).toBe("");
  });

  it("should return empty string for an invalid date string", () => {
    expect(formatDate("not-a-date")).toBe("");
  });

  it("should return empty string for NaN date", () => {
    expect(formatDate("2026-13-45")).toBe("");
  });
});
