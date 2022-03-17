async function demodemo() {
    event.preventDefault() ; // Add this line at the top to work with bootstrap forms
    //
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
    const publicKeyArmored = `-----BEGIN PGP PUBLIC KEY BLOCK-----
    
xjMEYjORhRYJKwYBBAHaRw8BAQdAwqEqhe8zDK2vscWV5a2suE1ctfRJsNHN
MOOK6hv9rp3NG0pvbiBTbWl0aCA8am9uQGV4YW1wbGUuY29tPsKMBBAWCgAd
BQJiM5GFBAsJBwgDFQgKBBYAAgECGQECGwMCHgEAIQkQPP9y68ymayMWIQQS
heQmPLYapWaMDbw8/3LrzKZrI43UAQC6C7kYmOZYfxO1QO4/a95mprlNJ88l
8HN3SNv6CuVz/wEAw00aUpDr648Qp6sA4BDlsn1A7KjhTDXhabK1TFweUgPO
OARiM5GFEgorBgEEAZdVAQUBAQdAwG3fciz0IfPLTde5fO2oP44kijfUTm/L
dUy0ir35Z00DAQgHwngEGBYIAAkFAmIzkYUCGwwAIQkQPP9y68ymayMWIQQS
heQmPLYapWaMDbw8/3LrzKZrI4GtAP9hgaGEM15sW6J+jQ68dGJ4S5ni3Eba
sXarAVF2E4nx5gD/UNaitb7k9YvUm2PbV6YnecSzgiuorerot5Qt3qa1UAM=
=u/Hi
-----END PGP PUBLIC KEY BLOCK-----`; // encrypted public key

    const privateKeyArmored = `-----BEGIN PGP PRIVATE KEY BLOCK-----

xYYEYjORhRYJKwYBBAHaRw8BAQdAwqEqhe8zDK2vscWV5a2suE1ctfRJsNHN
MOOK6hv9rp3+CQMIbAcEgKy5YRngEyQ5h11pJQTh/V8KvhYPf7ktzk2m0dj/
R47ynCpu4vtcHkqzDhBhtVbN5tVEUWpTYBtyDLDR8J4fksGfrGSGABU9vxwe
Ws0bSm9uIFNtaXRoIDxqb25AZXhhbXBsZS5jb20+wowEEBYKAB0FAmIzkYUE
CwkHCAMVCAoEFgACAQIZAQIbAwIeAQAhCRA8/3LrzKZrIxYhBBKF5CY8thql
ZowNvDz/cuvMpmsjjdQBALoLuRiY5lh/E7VA7j9r3mamuU0nzyXwc3dI2/oK
5XP/AQDDTRpSkOvrjxCnqwDgEOWyfUDsqOFMNeFpsrVMXB5SA8eLBGIzkYUS
CisGAQQBl1UBBQEBB0DAbd9yLPQh88tN17l87ag/jiSKN9ROb8t1TLSKvfln
TQMBCAf+CQMIJ70d/dOU9nHgp6Q5delpXCHI3iBUpQYLkFRIS/bQs7iEHBa2
IEzj3CBBlbySjmNUkhfE3YuMpHiS42MbtIDnWOm7mGniqTQNPjLMRu7TC8J4
BBgWCAAJBQJiM5GFAhsMACEJEDz/cuvMpmsjFiEEEoXkJjy2GqVmjA28PP9y
68ymayOBrQD/YYGhhDNebFuifo0OvHRieEuZ4txG2rF2qwFRdhOJ8eYA/1DW
orW+5PWL1Jtj21emJ3nEs4IrqK3q6LeULd6mtVAD
=D7Sn
-----END PGP PRIVATE KEY BLOCK-----`; // encrypted private key

    // READ PUBLIC KEY
    const publicKeyNew = await openpgp.readKey({ armoredKey: publicKeyArmored });

    // READ PRIVATE KEY AND DECRYPT
    const privateKeyNew = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase
    });
    //console.log(privateKeyNew);
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
