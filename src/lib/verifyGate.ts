/**
 * Module-scoped verification gate.
 *
 * The AuthContext mirrors the current user's verification state into this
 * module via `setGateUser`. Code paths that mutate user data (progress,
 * favorites, etc.) call `requireVerified` before touching the API. When the
 * caller is logged in but unverified, the gate fires a window CustomEvent
 * and the globally-mounted <VerifyDialog/> picks it up.
 *
 * Why a module global instead of context: the progress.ts service is a
 * plain ES module (no React tree access) and we don't want to refactor every
 * call site into a hook. The gate writes are one-way (AuthContext is the
 * only producer) so the module-global stays trivially in sync.
 */

type GateUser = { email?: string; isVerified?: boolean } | null;

let _user: GateUser = null;

export function setGateUser(u: GateUser) {
    _user = u;
}

export function getGateUser(): GateUser {
    return _user;
}

export const VERIFY_REQUIRED_EVENT = 'udarsy:verify-required';

export function triggerVerifyDialog() {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent(VERIFY_REQUIRED_EVENT));
}

/**
 * For explicit user actions (mark complete, favorite, etc.):
 *  - returns true  → caller may proceed
 *  - returns false → caller must abort, dialog has been opened
 *
 * Guests (not logged in) pass through; the existing auth-gate handles them.
 */
export function requireVerified(): boolean {
    if (!_user) return true;
    if (_user.isVerified === true) return true;
    triggerVerifyDialog();
    return false;
}

/**
 * For passive observers (track-view, debounced progress ticks):
 *  - returns true  → caller may proceed
 *  - returns false → caller silently skips, NO dialog dispatched
 *
 * Avoids spamming the dialog on every navigation / timer tick.
 */
export function isVerifiedOrGuest(): boolean {
    if (!_user) return true;
    return _user.isVerified === true;
}
