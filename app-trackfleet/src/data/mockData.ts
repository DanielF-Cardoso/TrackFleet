import { User } from '../types';

const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'demo@demo.com',
    role: 'admin',
};

const DEMO_EMAIL = 'demo@demo.com';
const DEMO_PASSWORD = '123456';

export const simulateLogin = async (email: string, password: string): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        return mockUser;
    }

    throw new Error('Invalid credentials');
}; 