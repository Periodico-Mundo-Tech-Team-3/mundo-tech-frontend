import { describe } from "vitest";
import { MOCK_USERS } from "../src/mocks/users";

describe("MOCK_USERS", () => {
  it("should contain 7 users", () => {
    expect(MOCK_USERS).toHaveLength(7);
  });

  it("should have all required fields on every user", () => {
    MOCK_USERS.forEach((user) => {
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("name");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("password");
      expect(user).toHaveProperty("roles");
      expect(typeof user.id).toBe("number");
      expect(typeof user.name).toBe("string");
      expect(typeof user.email).toBe("string");
      expect(typeof user.password).toBe("string");
    });
  });

  it("should have unique ids", () => {
    const ids = MOCK_USERS.map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("should have unique emails", () => {
    const emails = MOCK_USERS.map((u) => u.email);
    expect(new Set(emails).size).toBe(emails.length);
  });

  it("should have valid role structure on every user", () => {
    MOCK_USERS.forEach((user) => {
      expect(Array.isArray(user.roles)).toBe(true);
      expect(user.roles.length).toBeGreaterThan(0);
      user.roles.forEach((role) => {
        expect(role).toHaveProperty("id");
        expect(role).toHaveProperty("name");
        expect(["author", "manager"]).toContain(role.name);
      });
    });
  });

  it("should have at least one author", () => {
    const authors = MOCK_USERS.filter((u) =>
      u.roles.some((r) => r.name === "author")
    );
    expect(authors.length).toBeGreaterThanOrEqual(1);
  });

  it("should have at least one manager", () => {
    const managers = MOCK_USERS.filter((u) =>
      u.roles.some((r) => r.name === "manager")
    );
    expect(managers.length).toBeGreaterThanOrEqual(1);
  });

  it("should have at least one user with both roles", () => {
    const both = MOCK_USERS.filter(
      (u) =>
        u.roles.some((r) => r.name === "author") &&
        u.roles.some((r) => r.name === "manager")
    );
    expect(both.length).toBeGreaterThanOrEqual(1);
  });

  it("should have passwords with minimum 8 characters", () => {
    MOCK_USERS.forEach((user) => {
      expect(user.password.length).toBeGreaterThanOrEqual(8);
    });
  });

  it("should have valid email format on every user", () => {
    MOCK_USERS.forEach((user) => {
      expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });

  it("should have non-empty names for all users", () => {
    MOCK_USERS.forEach((user) => {
      expect(user.name.trim().length).toBeGreaterThan(0);
    });
  });
});
