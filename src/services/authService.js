/**
 * Authentication Service for MIRA NER
 * Manages user accounts, password verification, elder-friendly PIN authentication,
 * session persistence, and pre-configured demo personas.
 */

// Simple hashing utility for client-side prototype demonstration
function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return 'h_' + Math.abs(hash).toString(16);
}

// Clean default users
const INITIAL_DEMO_USERS = [];

class AuthService {
  constructor() {
    this.initUsers();
  }

  initUsers() {
    // No-op for demo seeding
  }

  getUsers() {
    try {
      const data = localStorage.getItem('mira_users');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveUsers(users) {
    localStorage.setItem('mira_users', JSON.stringify(users));
  }

  /**
   * Get active authenticated user session
   */
  getCurrentUser() {
    try {
      const uid = localStorage.getItem('mira_active_user_id');
      const users = this.getUsers();
      if (uid) {
        const found = users.find((u) => u.id === uid);
        if (found) return found;
      }
      const session = localStorage.getItem('mira_auth_session');
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  }

  /**
   * Authenticate with email and password
   */
  login(email, password) {
    const users = this.getUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return { success: false, error: 'No account found with this email address.' };
    }

    const hashed = hashPassword(password);
    if (user.passwordHash !== hashed) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    // Set session (exclude password hash)
    const sessionUser = { ...user };
    delete sessionUser.passwordHash;
    localStorage.setItem('mira_auth_session', JSON.stringify(sessionUser));

    return { success: true, user: sessionUser };
  }

  /**
   * Elder-friendly PIN Login (e.g. 4-digit numeric code)
   */
  loginWithPin(pin) {
    const users = this.getUsers();
    const trimmedPin = pin.trim();

    // Look for matching user PIN
    const user = users.find((u) => u.pin === trimmedPin);
    if (!user) {
      return { success: false, error: 'PIN not recognized. Please check with your caregiver.' };
    }

    const sessionUser = { ...user };
    delete sessionUser.passwordHash;
    localStorage.setItem('mira_auth_session', JSON.stringify(sessionUser));

    return { success: true, user: sessionUser };
  }


  /**
   * Register a new user and initialize their isolated space
   */
  signup({ name, email, password, role, pin = '1234', patientName = '', relation = '' }) {
    const users = this.getUsers();
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUserId = 'usr-' + Date.now();
    // Unique data space for this user / family
    const spaceId = 'space-' + Date.now();

    const newUser = {
      id: newUserId,
      email: normalizedEmail,
      name: name.trim(),
      role: role || 'guardian',
      passwordHash: hashPassword(password),
      pin: pin.trim() || '1234',
      spaceId: spaceId,
      relation: relation || (role === 'guardian' ? 'Caregiver' : 'Self'),
      avatar: role === 'guardian' ? '👩‍💼' : '👵',
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    this.saveUsers(updatedUsers);

    // Set active session
    const sessionUser = { ...newUser };
    delete sessionUser.passwordHash;
    localStorage.setItem('mira_auth_session', JSON.stringify(sessionUser));

    return { success: true, user: sessionUser, isNewSpace: true, spaceId, patientName };
  }

  /**
   * Sign out current user
   */
  logout() {
    localStorage.removeItem('mira_auth_session');
    return true;
  }
}

export const authService = new AuthService();
export default authService;
