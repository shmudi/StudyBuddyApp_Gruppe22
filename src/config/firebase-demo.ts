// Demo Firebase Config - for testing uten ekte Firebase
// DENNE FILEN BRUKES KUN FOR UTVIKLING UTEN FIREBASE

export const DEMO_MODE = true;

// Mock Firebase-funksjoner for testing
export const mockAuth = {
  currentUser: null,
  signInWithEmailAndPassword: async (email: string, password: string) => {
    console.log('DEMO: Login attempt with', email);
    return { user: { uid: 'demo-user-123', email } };
  },
  createUserWithEmailAndPassword: async (email: string, password: string) => {
    console.log('DEMO: Register attempt with', email);
    return { user: { uid: 'demo-user-123', email } };
  },
  signOut: async () => {
    console.log('DEMO: Logout');
  },
  sendPasswordResetEmail: async (email: string) => {
    console.log('DEMO: Password reset for', email);
  }
};

export const mockDb = {
  collection: () => ({
    addDoc: async (data: any) => {
      console.log('DEMO: Adding document', data);
      return { id: 'demo-doc-' + Date.now() };
    },
    getDocs: async () => {
      console.log('DEMO: Getting documents');
      return {
        forEach: (callback: any) => {
          // Mock data
          const mockTasks = [
            { id: 'demo-1', title: 'Demo oppgave 1', course: 'React Native', done: false },
            { id: 'demo-2', title: 'Demo oppgave 2', course: 'Firebase', done: true }
          ];
          mockTasks.forEach(task => {
            callback({
              id: task.id,
              data: () => ({ ...task, createdAt: new Date(), updatedAt: new Date() })
            });
          });
        }
      };
    }
  })
};

console.log('🔥 DEMO MODE: Firebase simulert lokalt');