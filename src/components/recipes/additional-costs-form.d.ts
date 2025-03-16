import { AdditionalCost } from "@/lib/types/recipe";

export interface AdditionalCostsFormProps {
  recipeId: string;
  additionalCosts?: AdditionalCost[];
  wasteFactor?: number | null;
}

export function AdditionalCostsForm(props: AdditionalCostsFormProps): JSX.Element;
