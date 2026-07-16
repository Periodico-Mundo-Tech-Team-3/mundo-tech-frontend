import { describe, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { MOCK_USERS } from "../src/mocks/users";

vi.mock("../src/services/userService", () => ({
  deleteAccount: vi.fn().mockResolvedValue(undefined),
}));

const STORAGE_KEY = "mundotech_user";

const TestConsumer = () => {
  const auth = useAuth();
  return (
    <div>
      <span data-testid="user-name">{auth.currentUser?.name || "no-user"}</span>
      <span data-testid="is-authenticated">{String(auth.isAuthenticated)}</span>
      <button data-testid="login-sofia" onClick={() => auth.login("sofia@mundotech.com", "hola7878")}>
        Login Sofia
      </button>
      <button data-testid="login-bad" onClick={() => auth.login("bad@email.com", "wrong")}>
        Login Bad
      </button>
      <button data-testid="logout-btn" onClick={auth.logout}>
        Logout
      </button>
      <button data-testid="delete-btn" onClick={auth.deleteAccount}>
        Delete
      </button>
    </div>
  );
};

const renderAuth = () =>
  render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  );

beforeEach(() => {
  localStorage.removeItem(STORAGE_KEY);
  vi.clearAllMocks();
});

describe("AuthContext", () => {
  describe("initial state", () => {
    it("should have no user when localStorage is empty", () => {
      renderAuth();
      expect(screen.getByTestId("user-name")).toHaveTextContent("no-user");
      expect(screen.getByTestId("is-authenticated")).toHaveTextContent("false");
    });

    it("should restore user from localStorage", () => {
      const { password: _, ...safeUser } = MOCK_USERS[0];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));

      renderAuth();
      expect(screen.getByTestId("user-name")).toHaveTextContent("Marta Ruiz");
      expect(screen.getByTestId("is-authenticated")).toHaveTextContent("true");
    });

    it("should treat stored null as unauthenticated", () => {
      localStorage.setItem(STORAGE_KEY, "null");
      renderAuth();
      expect(screen.getByTestId("is-authenticated")).toHaveTextContent("false");
    });
  });

  describe("login", () => {
    it("should authenticate with valid credentials", async () => {
      renderAuth();
      const user = userEvent.setup();

      await user.click(screen.getByTestId("login-sofia"));

      expect(screen.getByTestId("user-name")).toHaveTextContent("Sofía Lambert");
      expect(screen.getByTestId("is-authenticated")).toHaveTextContent("true");
    });

    it("should persist user to localStorage without password", async () => {
      renderAuth();
      const user = userEvent.setup();

      await user.click(screen.getByTestId("login-sofia"));

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored.name).toBe("Sofía Lambert");
      expect(stored.password).toBeUndefined();
    });

    it("should return error with invalid credentials", async () => {
      let result;
      const CaptureLogin = () => {
        const auth = useAuth();
        return (
          <button
            data-testid="bad-login"
            onClick={() => {
              result = auth.login("wrong@email.com", "badpass");
            }}
          >
            Bad Login
          </button>
        );
      };

      render(
        <AuthProvider>
          <CaptureLogin />
        </AuthProvider>
      );

      await userEvent.setup().click(screen.getByTestId("bad-login"));

      expect(result.success).toBe(false);
      expect(result.error).toBe("Email o contraseña incorrectos");
    });
  });

  describe("logout", () => {
    it("should clear currentUser and remove from localStorage", async () => {
      const { password: _, ...safeUser } = MOCK_USERS[2];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));

      renderAuth();
      const user = userEvent.setup();

      await user.click(screen.getByTestId("logout-btn"));

      expect(screen.getByTestId("user-name")).toHaveTextContent("no-user");
      expect(screen.getByTestId("is-authenticated")).toHaveTextContent("false");
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  describe("deleteAccount", () => {
    it("should call userService.deleteAccount and clear session on success", async () => {
      const { deleteAccount: mockedDelete } = await import("../src/services/userService");
      const { password: _, ...safeUser } = MOCK_USERS[2];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));

      renderAuth();
      const user = userEvent.setup();

      await user.click(screen.getByTestId("delete-btn"));

      expect(mockedDelete).toHaveBeenCalledWith(3);
      expect(screen.getByTestId("user-name")).toHaveTextContent("no-user");
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it("should return error when not authenticated", async () => {
      let result;
      const CaptureDelete = () => {
        const auth = useAuth();
        return (
          <button
            data-testid="delete-noauth"
            onClick={async () => {
              result = await auth.deleteAccount();
            }}
          >
            Delete NoAuth
          </button>
        );
      };

      render(
        <AuthProvider>
          <CaptureDelete />
        </AuthProvider>
      );

      await userEvent.setup().click(screen.getByTestId("delete-noauth"));

      expect(result.success).toBe(false);
      expect(result.error).toBe("No hay sesión activa");
    });

    it("should return error when API call fails", async () => {
      const { deleteAccount: mockedDelete } = await import("../src/services/userService");
      mockedDelete.mockRejectedValueOnce(new Error("Network error"));

      const { password: _, ...safeUser } = MOCK_USERS[2];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));

      let result;
      const CaptureDelete = () => {
        const auth = useAuth();
        return (
          <div>
            <span data-testid="user-name">{auth.currentUser?.name || "no-user"}</span>
            <button
              data-testid="delete-fail"
              onClick={async () => {
                result = await auth.deleteAccount();
              }}
            >
              Delete Fail
            </button>
          </div>
        );
      };

      render(
        <AuthProvider>
          <CaptureDelete />
        </AuthProvider>
      );

      expect(screen.getByTestId("user-name")).toHaveTextContent("Sofía Lambert");

      await userEvent.setup().click(screen.getByTestId("delete-fail"));

      expect(result.success).toBe(false);
      expect(result.error).toBe("No se pudo eliminar la cuenta");
      expect(screen.getByTestId("user-name")).toHaveTextContent("Sofía Lambert");
    });
  });

  describe("useAuth outside provider", () => {
    it("should throw error when used outside AuthProvider", () => {
      const BadConsumer = () => {
        useAuth();
        return null;
      };

      expect(() => render(<BadConsumer />)).toThrow(
        "useAuth debe usarse dentro de un AuthProvider"
      );
    });
  });
});
