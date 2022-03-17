async function demodemo() {
    
    event.preventDefault() ; 
    
    let inputTextBox1message = document.getElementById("inputTextBox1").value;
    let passphrase = document.getElementById("secretPassphrase").value;
    //const outputEncryptedTextArea = document.getElementById("outputEncryptedTextArea").value ;
    //const outputDecryptedTextArea = document.getElementById("outputDecryptedTextArea").value ;
    //const passphrase = `yourPassphrase`; // what the private key is encrypted with
    // const passphrase = secretPassphrase ; // what the private key is encrypted with

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
    console.log(privateKey);     // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
    console.log(publicKey);      // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
    console.log(revocationCertificate); // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
    //////////////////////////////////////////////////

    // put keys in backtick (``) to avoid errors caused by spaces or tabs
    const publicKeyArmored = publicKey; // encrypted public key
    const privateKeyArmored = privateKey; // encrypted private key

    // READ PUBLIC KEY
    const publicKeyNew = await openpgp.readKey({ armoredKey: publicKeyArmored });

    // READ PRIVATE KEY AND DECRYPT
    const privateKeyNew = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase
    });
    console.log(privateKeyNew);
    console.log(passphrase);

    const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: inputTextBox1message }), // input as Message object
        encryptionKeys: publicKeyNew,
        signingKeys: privateKeyNew // optional
    });
    console.log(encrypted); // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'

    const message = await openpgp.readMessage({
        armoredMessage: encrypted // parse armored message
    });
    //
    const { data: decrypted, signatures } = await openpgp.decrypt({
        message,
        verificationKeys: publicKeyNew, // optional
        decryptionKeys: privateKeyNew
    });
    console.log(decrypted); // 'Hello, World!'
    // check signature validity (signed messages only)
    try {
        await signatures[0].verified; // throws on invalid signature
        console.log('Signature is valid');
    } catch (e) {
        throw new Error('Signature could not be verified: ' + e.message);
    }

    document.getElementById("outputEncryptedTextArea").innerHTML = encrypted;
    document.getElementById("outputDecryptedTextArea").innerHTML = decrypted;

}
