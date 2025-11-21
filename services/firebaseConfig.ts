import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase
// IMPORTANTE: Substitua estas variáveis pelas suas credenciais do Firebase
// Você pode obter essas credenciais em: https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Inicializar Firebase apenas se houver configuração
let app: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;

const isFirebaseConfigured = () => {
  // Debug: verificar valores das variáveis
  console.log('🔍 Verificando configuração do Firebase:', {
    apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'vazio',
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
  });

  // Verificar se as variáveis não são valores de exemplo
  const hasValidConfig = !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.apiKey !== 'sua-api-key-aqui' &&
    firebaseConfig.authDomain !== 'seu-projeto.firebaseapp.com' &&
    firebaseConfig.projectId !== 'seu-project-id' &&
    firebaseConfig.apiKey.length > 20 && // API keys do Firebase são longas
    firebaseConfig.apiKey.startsWith('AIza') // API keys do Firebase começam com AIza
  );
  
  console.log('✅ Firebase configurado:', hasValidConfig);
  return hasValidConfig;
};

if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('✅ Firebase inicializado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error);
    app = null;
    auth = null;
    db = null;
  }
} else {
  console.warn('⚠️ Firebase não configurado. Configure as variáveis no .env.local ou use login por nome de usuário.');
  console.warn('💡 Dica: Reinicie o servidor após adicionar variáveis no .env.local');
}

export { auth, db, isFirebaseConfigured };
export const googleProvider = new GoogleAuthProvider();

