import crypto from 'crypto';

function gerarSalt(){
    return crypto.randomBytes(Math.ceil(9/2))
            .toString('hex')
            .slice(0,16); 
};

function sha512(senha){
    let hash = crypto.createHmac('sha512', senha); // Algoritmo de cripto sha512
    hash.update(senha);
    hash = hash.digest('hex');
    return hash;
};

export function encrypt(senha) {
    return sha512(senha); 
}

export function decrypt(senhaDoLogin, hashNoBanco) {
    let senhaESalt = sha512(senhaDoLogin);
    return hashNoBanco === senhaESalt;
 }