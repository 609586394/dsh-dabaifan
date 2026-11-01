/**
 * Host side of dsh-dabaifan.
 *
 * The plugin only contributes a browser-side panel; this file exists so the
 * package can be mounted as a node in the profile's cordis tree. The web half
 * is discovered through the `./client` export plus `dsh.client` in package.json.
 */
export function apply() {}
