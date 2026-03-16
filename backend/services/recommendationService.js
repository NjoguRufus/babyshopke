import { getFeaturedProducts, getActiveProducts } from "./productService.js";
import { getFamilyAccounts } from "./familyService.js";
import { getChildrenByFamily } from "./childProfileService.js";

export async function getRecommendationsForChild(childId, familyAccountId) {
  const products = await getActiveProducts();
  return products.slice(0, 12);
}

export async function getRecommendationsForFamily(familyAccountId) {
  const products = await getActiveProducts();
  return products.slice(0, 12);
}

export async function getPopularProducts() {
  const products = await getActiveProducts();
  return [...products].sort((a, b) => (b.totalViews || 0) - (a.totalViews || 0)).slice(0, 12);
}

export async function getFeaturedProductsList() {
  return getFeaturedProducts();
}
