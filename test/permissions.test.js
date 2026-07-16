import { describe } from "vitest";
import {
  isAuthor,
  isManager,
  canAccessRedaction,
  canAccessEditorial,
  canEdit,
  canDelete,
  canSendToReview,
  canPublish,
  canReject,
  canSeeInMyArticles,
} from "../src/utils/permissions";

const userAuthor = { id: 1, roles: [{ id: 1, name: "author" }] };
const userManager = { id: 2, roles: [{ id: 2, name: "manager" }] };
const userBoth = {
  id: 3,
  roles: [
    { id: 1, name: "author" },
    { id: 2, name: "manager" },
  ],
};
const userNone = { id: 4, roles: [] };

const articleDraftOwn = (userId) => ({
  id: 1,
  status: "DRAFT",
  author: { id: userId },
});
const articleReviewOwn = (userId) => ({
  id: 2,
  status: "IN_REVIEW",
  author: { id: userId },
});
const articlePublishedOwn = (userId) => ({
  id: 3,
  status: "PUBLISHED",
  author: { id: userId },
});
const articlePublishedOther = {
  id: 4,
  status: "PUBLISHED",
  author: { id: 99 },
};
describe("permisions", () => {
  describe("isAuthor", () => {
    it("should return true for a user with author role", () => {
      expect(isAuthor(userAuthor)).toBe(true);
    });

    it("should return true for a user with both roles", () => {
      expect(isAuthor(userBoth)).toBe(true);
    });

    it("should return false for a user with only manager role", () => {
      expect(isAuthor(userManager)).toBe(false);
    });

    it("should return false for a user with no roles", () => {
      expect(isAuthor(userNone)).toBe(false);
    });

    it("should return false for null user", () => {
      expect(isAuthor(null)).toBe(false);
    });

    it("should return false for undefined user", () => {
      expect(isAuthor(undefined)).toBe(false);
    });
  });

  describe("isManager", () => {
    it("should return true for a user with manager role", () => {
      expect(isManager(userManager)).toBe(true);
    });

    it("should return true for a user with both roles", () => {
      expect(isManager(userBoth)).toBe(true);
    });

    it("should return false for a user with only author role", () => {
      expect(isManager(userAuthor)).toBe(false);
    });

    it("should return false for a user with no roles", () => {
      expect(isManager(userNone)).toBe(false);
    });

    it("should return false for null user", () => {
      expect(isManager(null)).toBe(false);
    });
  });

  describe("canAccessRedaction", () => {
    it("should return true for an author", () => {
      expect(canAccessRedaction(userAuthor)).toBe(true);
    });

    it("should return false for a manager-only user", () => {
      expect(canAccessRedaction(userManager)).toBe(false);
    });
  });

  describe("canAccessEditorial", () => {
    it("should return true for a manager", () => {
      expect(canAccessEditorial(userManager)).toBe(true);
    });

    it("should return false for an author-only user", () => {
      expect(canAccessEditorial(userAuthor)).toBe(false);
    });
  });

  describe("canEdit", () => {
    it("should return true for the article owner", () => {
      const article = articleDraftOwn(1);
      expect(canEdit(userAuthor, article)).toBe(true);
    });

    it("should return false for a different user", () => {
      const article = articleDraftOwn(1);
      expect(canEdit(userManager, article)).toBe(false);
    });

    it("should return false when user is null", () => {
      const article = articleDraftOwn(1);
      expect(canEdit(null, article)).toBe(false);
    });

    it("should return false when article has no author", () => {
      const article = { id: 5, status: "DRAFT" };
      expect(canEdit(userAuthor, article)).toBe(false);
    });
  });

  describe("canDelete", () => {
    it("should return true for the article owner", () => {
      const article = articleDraftOwn(1);
      expect(canDelete(userAuthor, article)).toBe(true);
    });

    it("should return false for a different user", () => {
      const article = articleDraftOwn(1);
      expect(canDelete(userManager, article)).toBe(false);
    });
  });

  describe("canSendToReview", () => {
    it("should return true when owner and status is DRAFT", () => {
      const article = articleDraftOwn(1);
      expect(canSendToReview(userAuthor, article)).toBe(true);
    });

    it("should return false when user is not the owner", () => {
      const article = articleDraftOwn(1);
      expect(canSendToReview(userManager, article)).toBe(false);
    });

    it("should return false when status is not DRAFT", () => {
      const article = articleReviewOwn(1);
      expect(canSendToReview(userAuthor, article)).toBe(false);
    });

    it("should return false when status is PUBLISHED", () => {
      const article = articlePublishedOwn(1);
      expect(canSendToReview(userAuthor, article)).toBe(false);
    });

    it("should return false for null user", () => {
      const article = articleDraftOwn(1);
      expect(canSendToReview(null, article)).toBe(false);
    });
  });

  describe("canPublish", () => {
    it("should return true when manager and status is IN_REVIEW", () => {
      const article = articleReviewOwn(99);
      expect(canPublish(userManager, article)).toBe(true);
    });

    it("should return false when user is not a manager", () => {
      const article = articleReviewOwn(99);
      expect(canPublish(userAuthor, article)).toBe(false);
    });

    it("should return false when status is DRAFT", () => {
      const article = articleDraftOwn(99);
      expect(canPublish(userManager, article)).toBe(false);
    });

    it("should return false when status is PUBLISHED", () => {
      const article = articlePublishedOwn(99);
      expect(canPublish(userManager, article)).toBe(false);
    });

    it("should return true when user has both roles and status is IN_REVIEW", () => {
      const article = articleReviewOwn(99);
      expect(canPublish(userBoth, article)).toBe(true);
    });
  });

  describe("canReject", () => {
    it("should return true when manager and status is IN_REVIEW", () => {
      const article = articleReviewOwn(99);
      expect(canReject(userManager, article)).toBe(true);
    });

    it("should return false when user is not a manager", () => {
      const article = articleReviewOwn(99);
      expect(canReject(userAuthor, article)).toBe(false);
    });

    it("should return false when status is DRAFT", () => {
      const article = articleDraftOwn(99);
      expect(canReject(userManager, article)).toBe(false);
    });
  });

  describe("canSeeInMyArticles", () => {
    it("should return true for a PUBLISHED article even when not the owner", () => {
      expect(canSeeInMyArticles(userAuthor, articlePublishedOther)).toBe(true);
    });

    it("should return true for own DRAFT article", () => {
      const article = articleDraftOwn(1);
      expect(canSeeInMyArticles(userAuthor, article)).toBe(true);
    });

    it("should return false for a non-owner DRAFT article", () => {
      const article = articleDraftOwn(99);
      expect(canSeeInMyArticles(userAuthor, article)).toBe(false);
    });

    it("should return false for a non-owner IN_REVIEW article", () => {
      const article = articleReviewOwn(99);
      expect(canSeeInMyArticles(userAuthor, article)).toBe(false);
    });

    it("should return true for own IN_REVIEW article", () => {
      const article = articleReviewOwn(1);
      expect(canSeeInMyArticles(userAuthor, article)).toBe(true);
    });
  });
});
