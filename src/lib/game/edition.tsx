import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  GREEK_TEAM_NAMES,
  ROLE_CUSTOMER,
  ROLE_CUSTOMER_GENERAL,
  ROLE_SHORT,
  ROLE_SHORT_GENERAL,
  TEAM_NAMES,
  type Edition,
  type Role,
} from "./types";

const EDITION_STORAGE_KEY = "bullwhip-edition";
const EDITION_CHOSEN_KEY = "bullwhip-edition-chosen";

export interface EditionConfig {
  id: Edition;
  appName: string;
  subtitle: string;
  eyebrow: string;
  productTitle: string;
  productSubtitle: string;
  productBadge: string;
  unitLabel: string;
  chainLabel: string;
  footerLeft: string;
  footerRight: string;
  roleShort: Record<Role, string>;
  roleCustomer: Record<Role, string>;
  teamNames: readonly string[];
  allowCustomTeamNames: boolean;
}

export const EDITION_CONFIG: Record<Edition, EditionConfig> = {
  ung: {
    id: "ung",
    appName: "Nighthawk Chain",
    subtitle: "UNG Supply Chain Lab",
    eyebrow: "University of North Georgia",
    productTitle: "Nighthawk gear",
    productSubtitle: "Cases moving from factory to Dahlonega shop",
    productBadge: "Nighthawk gear · cases",
    unitLabel: "Nighthawk gear",
    chainLabel: "campus",
    footerLeft: "University of North Georgia · Operations classroom lab",
    footerRight: "12 weeks · four seats · © Varun Gupta",
    roleShort: ROLE_SHORT,
    roleCustomer: ROLE_CUSTOMER,
    teamNames: TEAM_NAMES,
    allowCustomTeamNames: false,
  },
  general: {
    id: "general",
    appName: "Bullwhip Lab",
    subtitle: "Supply Chain Simulation",
    eyebrow: "Operations & Supply Chain Simulation",
    productTitle: "Supply chain network",
    productSubtitle: "Cases moving from factory to retail store",
    productBadge: "Standard units · cases",
    unitLabel: "standard cases",
    chainLabel: "chain",
    footerLeft: "Supply Chain Operations Lab · Interactive Simulation",
    footerRight: "12 weeks · four echelons · © Varun Gupta",
    roleShort: ROLE_SHORT_GENERAL,
    roleCustomer: ROLE_CUSTOMER_GENERAL,
    teamNames: GREEK_TEAM_NAMES,
    allowCustomTeamNames: true,
  },
};

interface EditionContextValue {
  edition: Edition;
  hasChosenEdition: boolean;
  config: EditionConfig;
  setEdition: (edition: Edition) => void;
  resetEditionChoice: () => void;
}

const EditionContext = createContext<EditionContextValue>({
  edition: "ung",
  hasChosenEdition: false,
  config: EDITION_CONFIG.ung,
  setEdition: () => {},
  resetEditionChoice: () => {},
});

export function readStoredEdition(): Edition {
  if (typeof window === "undefined") return "ung";
  const params = new URLSearchParams(window.location.search);
  const queryEd = params.get("edition");
  if (queryEd === "general" || queryEd === "ung") {
    return queryEd;
  }
  const stored = window.localStorage.getItem(EDITION_STORAGE_KEY);
  return stored === "general" ? "general" : "ung";
}

export function EditionProvider({ children }: { children: ReactNode }) {
  const [edition, setEditionState] = useState<Edition>("ung");
  const [hasChosenEdition, setHasChosenEdition] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const queryEd = params.get("edition");
    if (queryEd === "general" || queryEd === "ung") {
      setEditionState(queryEd);
      setHasChosenEdition(true);
      window.localStorage.setItem(EDITION_STORAGE_KEY, queryEd);
      window.localStorage.setItem(EDITION_CHOSEN_KEY, "1");
      document.documentElement.dataset.edition = queryEd;
      return;
    }

    const stored = window.localStorage.getItem(EDITION_STORAGE_KEY);
    const chosen = window.localStorage.getItem(EDITION_CHOSEN_KEY) === "1";
    const resolved: Edition = stored === "general" ? "general" : "ung";
    setEditionState(resolved);
    setHasChosenEdition(chosen);
    document.documentElement.dataset.edition = resolved;
  }, []);

  const setEdition = (next: Edition) => {
    setEditionState(next);
    setHasChosenEdition(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(EDITION_STORAGE_KEY, next);
      window.localStorage.setItem(EDITION_CHOSEN_KEY, "1");
      document.documentElement.dataset.edition = next;
    }
  };

  const resetEditionChoice = () => {
    setHasChosenEdition(false);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(EDITION_CHOSEN_KEY);
    }
  };

  return (
    <EditionContext.Provider
      value={{
        edition,
        hasChosenEdition,
        config: EDITION_CONFIG[edition],
        setEdition,
        resetEditionChoice,
      }}
    >
      {children}
    </EditionContext.Provider>
  );
}

export function useEdition(): EditionContextValue {
  return useContext(EditionContext);
}
