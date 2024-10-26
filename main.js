/* global Go, generateSelfSignedPersonalCertificate */
{
    const go = new Go();
    let wasmMod, wasmInst;

    WebAssembly.instantiateStreaming(fetch(window.wasmURL), go.importObject)
        .then((wasmInstantiated) => {
            wasmMod = wasmInstantiated.module;
            wasmInst = wasmInstantiated.instance;

            go.run(wasmInst);
        })
        .catch((err) => console.error(err));

    document.addEventListener('DOMContentLoaded', () => {
        const emailInput = document.querySelector('input#email');
        const validForCoefficientInput = document.querySelector('input#valid-for-coefficient');
        const validForBaseInput = document.querySelector('input#valid-for-base');
        const passwordInput = document.querySelector('input#password');

        const paramsForm = document.querySelector('form#params');
        const runButton = document.querySelector('button#run');
        const responsesDiv = document.querySelector('div#responses');

        const runEventHandler = async (evt) => {
            try {
                const email = emailInput.value;
                const validFor = parseInt(validForCoefficientInput.value, 10) * parseInt(validForBaseInput.value, 10);
                const password = passwordInput.value;

                const resContainerDiv = document.createElement('div');
                const resListUl = document.createElement('ul');
                const keyLi = document.createElement('li');
                const keyAnchor = document.createElement('a');
                const certLi = document.createElement('li');
                const certAnchor = document.createElement('a');

                const generated = generateSelfSignedPersonalCertificate(email, validFor, password);

                keyAnchor.appendChild(document.createTextNode('Private key PKCS12'));
                keyAnchor.href = `data:application/x-pkcs12;base64,${generated.key}`;
                keyLi.appendChild(keyAnchor);
                resListUl.appendChild(keyLi);

                certAnchor.appendChild(document.createTextNode('Certificate DER'));
                certAnchor.href = `data:application/pkix-cert;base64,${generated.cert}`;
                certLi.appendChild(certAnchor);
                resListUl.appendChild(certLi);

                resContainerDiv.appendChild(resListUl);
                responsesDiv.appendChild(resContainerDiv);
            } catch (err) {
                console.log(err);
            } finally {
                paramsForm.reset();
                evt.preventDefault();

                wasmInst = await WebAssembly.instantiate(wasmMod, go.importObject);
                go.run(wasmInst).catch((err) => console.error(err));
            }
        };

        paramsForm.addEventListener('submit', runEventHandler);
        runButton.addEventListener('click', runEventHandler);
    });
}
