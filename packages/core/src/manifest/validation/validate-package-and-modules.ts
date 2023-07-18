import type { Package } from "../../proto.js";
import { validateModules } from "./validate-modules.js";
import { type ValidatePackageOptions, validatePackage } from "./validate-package.js";

export function validatePackageAndModules(pkg: Package, options?: ValidatePackageOptions) {
  validatePackage(pkg, options);
  // rome-ignore lint/style/noNonNullAssertion: existence of `pkg.modules` is checked in `validatePackage`
  validateModules(pkg.modules!);
}
