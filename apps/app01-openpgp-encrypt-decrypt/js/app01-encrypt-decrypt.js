/*****************************************/
// following is the main function to do all encrypting/decryption operations
async function encryptOrDecryptThisText() {
    event.preventDefault() ; // Add this line at the top to work with bootstrap forms
    //
    // what the private key is encrypted with (in base64 encoding)
    let passphrase = atob('cGFsaS4yMDIy') ; 
    //
    let inputTextBox1message = document.getElementById("inputTextBox1").value;

    //////////////////////////////////////////////////

// put keys in backtick (``) to avoid errors caused by spaces or tabs
const privateKeyArmored = `-----BEGIN PGP PRIVATE KEY BLOCK-----

xYYEYjOt1xYJKwYBBAHaRw8BAQdA91H8S03rmIaVqfdSQ92aOL1hkFVXepf4
oFUqM6nj1q/+CQMIAFH7cjgN+R7gnlaIGP6HZ52sNdXKApkOxZg1ctZMp8TF
hYKLOah+B68zeLaLUNhr0Nlsf81HJHEQFP7W2Sxz45PrE14p0rFZNV7vJJlM
/c0bSm9uIFNtaXRoIDxqb25AZXhhbXBsZS5jb20+wowEEBYKAB0FAmIzrdcE
CwkHCAMVCAoEFgACAQIZAQIbAwIeAQAhCRDCP6eRJ88FZBYhBHJbxk+Cr4v2
xlpzIMI/p5EnzwVkk5sA/RvJeNv1BFE2tW7kELEuAY0CN6zj+aAQ+jso3oOf
AgG/AQDRUL+EJ9T6IzypjE1lgaoK0ifChveb0PetTelkzdsyBMeLBGIzrdcS
CisGAQQBl1UBBQEBB0BowYuyF/SGTFoX1agknG3e4wsaqtBnzEtdbHb17RMp
dwMBCAf+CQMIw8QoTy2ob2LgMXA4DvcX1SQ9Z+LWi9G1bEhW0S6cD8ChuH1P
lmxSYeI4jj73zYJuxN+cEYd9X4UOcZIEbYobWZWDyyxXORfdkaJ4aTjDH8J4
BBgWCAAJBQJiM63XAhsMACEJEMI/p5EnzwVkFiEEclvGT4Kvi/bGWnMgwj+n
kSfPBWT1qAEAkOr5D66gEiye8aXgnPbyJRaDf+GYET8Nr9KC0MH+EXkA/inB
wvytB7ifcRPJ2kblzENC5fvR4x7tfaQpUCg8dA0H
=jgbu
-----END PGP PRIVATE KEY BLOCK-----` ; // encrypted private key
//
const publicKeyArmored = `-----BEGIN PGP PUBLIC KEY BLOCK-----

xjMEYjOt1xYJKwYBBAHaRw8BAQdA91H8S03rmIaVqfdSQ92aOL1hkFVXepf4
oFUqM6nj1q/NG0pvbiBTbWl0aCA8am9uQGV4YW1wbGUuY29tPsKMBBAWCgAd
BQJiM63XBAsJBwgDFQgKBBYAAgECGQECGwMCHgEAIQkQwj+nkSfPBWQWIQRy
W8ZPgq+L9sZacyDCP6eRJ88FZJObAP0byXjb9QRRNrVu5BCxLgGNAjes4/mg
EPo7KN6DnwIBvwEA0VC/hCfU+iM8qYxNZYGqCtInwob3m9D3rU3pZM3bMgTO
OARiM63XEgorBgEEAZdVAQUBAQdAaMGLshf0hkxaF9WoJJxt3uMLGqrQZ8xL
XWx29e0TKXcDAQgHwngEGBYIAAkFAmIzrdcCGwwAIQkQwj+nkSfPBWQWIQRy
W8ZPgq+L9sZacyDCP6eRJ88FZPWoAQCQ6vkPrqASLJ7xpeCc9vIlFoN/4ZgR
Pw2v0oLQwf4ReQD+KcHC/K0HuJ9xE8naRuXMQ0Ll+9HjHu19pClQKDx0DQc=
=Goo1
-----END PGP PUBLIC KEY BLOCK-----` ; // encrypted public key

    // READ PUBLIC KEY
    const publicKeyNew = await openpgp.readKey({ armoredKey: publicKeyArmored });

    // READ PRIVATE KEY AND DECRYPT
    const privateKeyNew = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase
    });
    //console.log(privateKeyNew);
    //console.log(passphrase);

    const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: inputTextBox1message }), // input as Message object
        encryptionKeys: publicKeyNew,
        signingKeys: privateKeyNew // before doing this, this key should have already been decrypted.
    });
    //console.log(encrypted); // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'

    /********************************/
    // CHECK WHETHER THE TEXT TO DECRYPT IS VALID PGP MESSAGE (means a valid armored message)
    let re = new RegExp('-----BEGIN PGP MESSAGE') ;
    let validPGPmessage ; 
    //
    if ( re.test(inputTextBox1message) ) {
        validPGPmessage = inputTextBox1message ; 
        console.log('>> FOUND VALUE IN INPUT BOX: PGP-Encrypted Message') ; 
    } else {
        validPGPmessage = encrypted ;
        console.log('>> FOUND VALUE IN INPUT BOX: Plain Text Message') ; 
    }
    //
    /********************************/
    const message = await openpgp.readMessage({ 
        armoredMessage: validPGPmessage // parse armored message 
    });  
    //console.log(message)  ; 
    /********************************/

    const { data: decrypted, signatures } = await openpgp.decrypt({
        message,
        verificationKeys: publicKeyNew, // optional.
        decryptionKeys: privateKeyNew // before doing this, this key should have already been decrypted.
    });
    //console.log(decrypted); // 'Hello, World!'
    //
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

/*****************************************/
function reloadPageSetDefaults () {
    location.reload(); // reload page and reset to defaults
}

/*****************************************/
function copyEncryptedText() {
  /* Get the text field */
  let copyText = document.getElementById("outputEncryptedTextArea");
  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */
  /* Copy the text inside the text field */
  //navigator.clipboard.writeText(copyText.value); 
  document.execCommand("copy") ; // execute system command
  /* Alert the copied text */
  alert("Copied encrypted text.");
}

/*****************************************/
function copyDecryptedText() {
  /* Get the text field */
  let copyText = document.getElementById("outputDecryptedTextArea");
  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */
  /* Copy the text inside the text field */
  //navigator.clipboard.writeText(copyText.value); 
  document.execCommand("copy") ; // execute system command
  /* Alert the copied text */
  alert("Copied decrypted text.");
}

/*****************************************/
function shareEncryptedText() {
  /* Get the text field */
  let getTextToShare = document.getElementById("outputEncryptedTextArea").value ;
  let  textToShare = 'https://wa.me/?text=' + encodeURIComponent(getTextToShare) ; 
  //console.log(textToShare) ;
  window.open(textToShare) ; 
}

/*****************************************/
function shareDecryptedText() {
  /* Get the text field */
  let getTextToShare = document.getElementById("outputDecryptedTextArea").value ;
  let  textToShare = 'https://wa.me/?text=' + encodeURIComponent(getTextToShare) ; 
  //console.log(textToShare) ;
  window.open(textToShare) ; 
}
