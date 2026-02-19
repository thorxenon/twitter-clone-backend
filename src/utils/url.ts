export const getUrl = (url: string): string =>{
    return `http://${process.env.HOST}:${process.env.PORT}${url}`;
}