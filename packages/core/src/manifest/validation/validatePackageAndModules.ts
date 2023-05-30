import type { Package } from "../../proto/sf/substreams/v1/package_pb.js";
import { validateModules } from "./validateModules.js";
import { type ValidatePackageOptions, validatePackage } from "./validatePackage.js";

export function validatePackageAndModules(pkg: Package, options?: ValidatePackageOptions) {
  validatePackage(pkg, options);
  // rome-ignore lint/style/noNonNullAssertion: existence of `pkg.modules` is checked in `validatePackage`
  validateModules(pkg.modules!);
}
