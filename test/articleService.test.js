import { describe, vi, beforeEach } from "vitest";
import {
  getAllArticles,
  getArticleById,
  getArticlesByStatus,
  getArticlesByAuthor,
  createArticle,
  updateArticle,
  deleteArticle,
  submitArticle,
  publishArticle,
  rejectArticle,
} from "../src/services/articleService";

const { mockGet, mockPost, mockPut, mockDelete } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
  mockPut: vi.fn(),
  mockDelete: vi.fn(),
}));

vi.mock("axios", () => ({
  default: {
    create: () => ({
      get: mockGet,
      post: mockPost,
      put: mockPut,
      delete: mockDelete,
    }),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

const fakeArticle = { title: "Test", content: "Contenido" };
const fakeResponse = { id: 1, ...fakeArticle };

describe("articleService", () => {
  describe("getAllArticles", () => {
    it("should call GET /api/v1/articles and return data", async () => {
      mockGet.mockResolvedValueOnce({ data: [fakeResponse] });

      const result = await getAllArticles();

      expect(mockGet).toHaveBeenCalledWith("/api/v1/articles");
      expect(result).toEqual([fakeResponse]);
    });
  });

  describe("getArticleById", () => {
    it("should call GET /api/v1/articles/:id and return data", async () => {
      mockGet.mockResolvedValueOnce({ data: fakeResponse });

      const result = await getArticleById(5);

      expect(mockGet).toHaveBeenCalledWith("/api/v1/articles/5");
      expect(result).toEqual(fakeResponse);
    });
  });

  describe("getArticlesByStatus", () => {
    it("should call GET /api/v1/articles/status with query params", async () => {
      mockGet.mockResolvedValueOnce({ data: [fakeResponse] });

      const result = await getArticlesByStatus("IN_REVIEW", 3);

      expect(mockGet).toHaveBeenCalledWith("/api/v1/articles/status", {
        params: { status: "IN_REVIEW", userId: 3 },
      });
      expect(result).toEqual([fakeResponse]);
    });
  });

  describe("getArticlesByAuthor", () => {
    it("should call GET /api/v1/articles/author with authorId param", async () => {
      mockGet.mockResolvedValueOnce({ data: [fakeResponse] });

      const result = await getArticlesByAuthor(7);

      expect(mockGet).toHaveBeenCalledWith("/api/v1/articles/author", {
        params: { authorId: 7 },
      });
      expect(result).toEqual([fakeResponse]);
    });
  });

  describe("createArticle", () => {
    it("should POST multipart form data to /api/v1/articles/:userId", async () => {
      mockPost.mockResolvedValueOnce({ data: fakeResponse });

      const result = await createArticle(3, fakeArticle, null);

      expect(mockPost).toHaveBeenCalledWith("/api/v1/articles/3", expect.any(FormData));
      const formData = mockPost.mock.calls[0][1];
      expect(formData.get("article")).toBeInstanceOf(Blob);
      expect(JSON.parse(await formData.get("article").text())).toEqual(fakeArticle);
      expect(formData.get("file")).toBeNull();
      expect(result).toEqual(fakeResponse);
    });

    it("should include file in FormData when provided", async () => {
      const file = new File(["content"], "image.png", { type: "image/png" });
      mockPost.mockResolvedValueOnce({ data: fakeResponse });

      await createArticle(3, fakeArticle, file);

      const formData = mockPost.mock.calls[0][1];
      expect(formData.get("file")).toBe(file);
    });
  });

  describe("updateArticle", () => {
    it("should PUT multipart form data to /api/v1/articles/:id/:userLoginId", async () => {
      mockPut.mockResolvedValueOnce({ data: fakeResponse });

      const result = await updateArticle(5, 3, fakeArticle, null);

      expect(mockPut).toHaveBeenCalledWith("/api/v1/articles/5/3", expect.any(FormData));
      const formData = mockPut.mock.calls[0][1];
      expect(JSON.parse(await formData.get("article").text())).toEqual(fakeArticle);
      expect(formData.get("file")).toBeNull();
      expect(result).toEqual(fakeResponse);
    });

    it("should include file in FormData when provided", async () => {
      const file = new File(["img"], "photo.jpg", { type: "image/jpeg" });
      mockPut.mockResolvedValueOnce({ data: fakeResponse });

      await updateArticle(5, 3, fakeArticle, file);

      const formData = mockPut.mock.calls[0][1];
      expect(formData.get("file")).toBe(file);
    });
  });

  describe("deleteArticle", () => {
    it("should call DELETE /api/v1/articles/:id/:userLoginId", async () => {
      mockDelete.mockResolvedValueOnce({});

      await deleteArticle(5, 3);

      expect(mockDelete).toHaveBeenCalledWith("/api/v1/articles/5/3");
    });
  });

  describe("submitArticle", () => {
    it("should call GET /api/v1/articles/:id/submit with userId param", async () => {
      mockGet.mockResolvedValueOnce({ data: fakeResponse });

      const result = await submitArticle(5, 3);

      expect(mockGet).toHaveBeenCalledWith("/api/v1/articles/5/submit", {
        params: { userId: 3 },
      });
      expect(result).toEqual(fakeResponse);
    });
  });

  describe("publishArticle", () => {
    it("should call GET /api/v1/articles/:id/publish with userId param", async () => {
      mockGet.mockResolvedValueOnce({ data: fakeResponse });

      const result = await publishArticle(5, 3);

      expect(mockGet).toHaveBeenCalledWith("/api/v1/articles/5/publish", {
        params: { userId: 3 },
      });
      expect(result).toEqual(fakeResponse);
    });
  });

  describe("rejectArticle", () => {
    it("should call GET /api/v1/articles/:id/reject with userId param", async () => {
      mockGet.mockResolvedValueOnce({ data: fakeResponse });

      const result = await rejectArticle(5, 3);

      expect(mockGet).toHaveBeenCalledWith("/api/v1/articles/5/reject", {
        params: { userId: 3 },
      });
      expect(result).toEqual(fakeResponse);
    });
  });
});
