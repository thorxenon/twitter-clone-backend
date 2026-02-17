declare global{
    namespace Express{
        interface User{
            slug: string;
            role: string;
        }


        interface Request{
            user?: User
        }
    }
}

export {};