
import { Produit } from "@/types";

export function isRequiredField(fieldName: string): boolean {
  return (
    fieldName === "codeArticle" ||
    fieldName === "numeroLigne" ||
    fieldName === "designation"
  );
}

// Additional utils can be added here, e.g., for field or bloc visibility if desired.
