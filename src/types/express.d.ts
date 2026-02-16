declare global{
    namespace Express{
        interface User{
            id: number;
            nickname: string;
            role: string;
        }


        interface Request{
            user?: User
        }
    }
}

export {};