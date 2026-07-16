import { describe, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "../src/routes/ProtectedRoute";

vi.mock("../src/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Navigate: vi.fn(({ to }) => <div data-testid="navigate">redirect:{to}</div>),
  };
});

const { useAuth } = await import("../src/context/AuthContext");

const user = { id: 1, name: "Test", roles: [{ name: "author" }] };

const allowAll = () => true;
const denyAll = () => false;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ProtectedRoute", () => {
  describe("when user is NOT authenticated", () => {
    beforeEach(() => {
      useAuth.mockReturnValue({ currentUser: null, isAuthenticated: false });
    });

    it("should redirect to /login", () => {
      render(
        <ProtectedRoute>
          <span data-testid="content">children</span>
        </ProtectedRoute>
      );

      expect(screen.getByTestId("navigate")).toHaveTextContent("redirect:/login");
      expect(screen.queryByTestId("content")).toBeNull();
    });
  });

  describe("when user is authenticated", () => {
    describe("without requirePermission", () => {
      beforeEach(() => {
        useAuth.mockReturnValue({ currentUser: user, isAuthenticated: true });
      });

      it("should render children", () => {
        render(
          <ProtectedRoute>
            <span data-testid="content">children</span>
          </ProtectedRoute>
        );

        expect(screen.getByTestId("content")).toHaveTextContent("children");
        expect(screen.queryByTestId("navigate")).toBeNull();
      });
    });

    describe("with requirePermission", () => {
      it("should render children when permission check passes", () => {
        useAuth.mockReturnValue({ currentUser: user, isAuthenticated: true });

        render(
          <ProtectedRoute requirePermission={allowAll}>
            <span data-testid="content">children</span>
          </ProtectedRoute>
        );

        expect(screen.getByTestId("content")).toHaveTextContent("children");
        expect(screen.queryByTestId("navigate")).toBeNull();
      });

      it("should redirect to / when permission check fails", () => {
        useAuth.mockReturnValue({ currentUser: user, isAuthenticated: true });

        render(
          <ProtectedRoute requirePermission={denyAll}>
            <span data-testid="content">children</span>
          </ProtectedRoute>
        );

        expect(screen.getByTestId("navigate")).toHaveTextContent("redirect:/");
        expect(screen.queryByTestId("content")).toBeNull();
      });

      it("should call requirePermission with currentUser", () => {
        const requirePermission = vi.fn().mockReturnValue(true);
        useAuth.mockReturnValue({ currentUser: user, isAuthenticated: true });

        render(
          <ProtectedRoute requirePermission={requirePermission}>
            <span data-testid="content">children</span>
          </ProtectedRoute>
        );

        expect(requirePermission).toHaveBeenCalledWith(user);
      });
    });
  });
});
