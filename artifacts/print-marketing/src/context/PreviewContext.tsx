import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface PreviewContextValue {
  previewing: boolean;
  setPreviewing: (value: boolean) => void;
}

const PreviewContext = createContext<PreviewContextValue>({
  previewing: false,
  setPreviewing: () => {},
});

export function PreviewProvider({ children }: { children: ReactNode }) {
  const [previewing, setPreviewing] = useState(false);

  useEffect(() => {
    if (previewing) {
      document.body.classList.add("print-preview");
    } else {
      document.body.classList.remove("print-preview");
    }
    return () => {
      document.body.classList.remove("print-preview");
    };
  }, [previewing]);

  return (
    <PreviewContext.Provider value={{ previewing, setPreviewing }}>
      {children}
    </PreviewContext.Provider>
  );
}

export function usePreview() {
  return useContext(PreviewContext);
}
