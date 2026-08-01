"use client";

import { getActiveVertical, getActiveVerticalTerms, BusinessVertical, VerticalTermConfig } from "../config/business.config";

export function useBusiness(): { vertical: BusinessVertical; terms: VerticalTermConfig } {
  const vertical = getActiveVertical();
  const terms = getActiveVerticalTerms();

  return {
    vertical,
    terms,
  };
}
