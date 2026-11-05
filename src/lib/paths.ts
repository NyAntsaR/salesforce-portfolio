/**
 * Prefixes a path to a file in /public with the configured base path.
 * next/link applies basePath automatically; plain <a href> and <img src> do not.
 */
export function withBasePath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
