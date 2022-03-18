async function generatePublicPrivateKeys() {
    event.preventDefault() ; // Add this line at the top to work with bootstrap forms
    //
    let passphrase = document.getElementById("secretPassphrase").value; // what the private key is encrypted with

    //////////////////////////////////////////////////
    // GENERATE KEYS
    const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey({
        type: 'ecc', // Type of the key, defaults to ECC
        curve: 'curve25519', // ECC curve name, defaults to curve25519
        userIDs: [{ name: 'Jon Smith', email: 'jon@example.com' }], // you can pass multiple user IDs
        passphrase: passphrase, // protects the private key
        format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
    });
    ////
    //console.log(privateKey);     // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
    //console.log(publicKey);      // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
    //console.log(revocationCertificate); // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
    //////////////////////////////////////////////////

    document.getElementById("outputPublicKeyTextArea").innerHTML = publicKey;
    document.getElementById("outputPrivateKeyTextArea").innerHTML = privateKey;
    document.getElementById("outputKeyRevocationTextArea").innerHTML = revocationCertificate;
}
