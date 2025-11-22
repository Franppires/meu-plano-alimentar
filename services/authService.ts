import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from './firebaseConfig';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export const authService = {
  registerWithEmailAndPassword: async (email, password, name) => {
    if (!isFirebaseConfigured() || !auth) {
      throw new Error('Firebase não está configurado. Por favor, configure as variáveis de ambiente no arquivo .env.local com suas credenciais do Firebase.');
    }
  
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      await updateProfile(user, { displayName: name });
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
    } catch (error) {
      console.error('Erro ao registrar com email e senha:', error);
      throw error;
    }
  },

  signInWithEmailAndPassword: async (email, password) => {
    if (!isFirebaseConfigured() || !auth) {
      throw new Error('Firebase não está configurado. Por favor, configure as variáveis de ambiente no arquivo .env.local com suas credenciais do Firebase.');
    }
  
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
    } catch (error) {
      console.error('Erro ao fazer login com email e senha:', error);
      throw error;
    }
  },
  
  // Login com Google
  signInWithGoogle: async (): Promise<User | null> => {
    if (!isFirebaseConfigured() || !auth) {
      throw new Error('Firebase não está configurado. Por favor, configure as variáveis de ambiente no arquivo .env.local com suas credenciais do Firebase.');
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
    } catch (error: any) {
      console.error('Erro ao fazer login com Google:', error);
      
      // Mensagens de erro mais amigáveis
      if (error.code === 'auth/configuration-not-found') {
        throw new Error('Firebase não está configurado corretamente. Verifique se preencheu todas as variáveis no arquivo .env.local e reinicie o servidor.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Login cancelado. Tente novamente.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup bloqueado pelo navegador. Permita popups para este site.');
      }
      
      throw error;
    }
  },

  // Logout
  signOut: async (): Promise<void> => {
    if (!isFirebaseConfigured() || !auth) {
      return;
    }

    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  },

  // Obter usuário atual
  getCurrentUser: (): User | null => {
    if (!isFirebaseConfigured() || !auth) {
      return null;
    }

    const user = auth.currentUser;
    if (!user) return null;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  },

  // Observar mudanças no estado de autenticação
  onAuthStateChange: (callback: (user: User | null) => void): (() => void) => {
    if (!isFirebaseConfigured() || !auth) {
      // Se Firebase não estiver configurado, retornar função vazia
      return () => {};
    }

    return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        callback({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        callback(null);
      }
    });
  },

  // Verificar se Firebase está configurado
  isConfigured: (): boolean => {
    return isFirebaseConfigured();
  },
};

