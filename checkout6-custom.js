window.onload = () => {
    window.addEventListener("hashchange", initialCharge, false);
    initialCharge();
}

const initialCharge = () => {
    if(window.location.hash === '#/profile') {
        document.querySelector('#client-company-ie').style.marginBottom = '5px';
        disabledContinue(true);
        processValidation();
        const showCorporateForm = document.querySelector('#is-corporate-client');
        showCorporateForm.addEventListener('click', () => {
            processValidation();
        });
        const hiddenCorporateForm = document.querySelector('#not-corporate-client');
        hiddenCorporateForm.addEventListener('click', () => {
            processValidation();
        });
        document.querySelector('#client-company-ie').addEventListener('input', () => {
            processValidation();
        });
    }
}

const processValidation = () => {
    const isCorporate = document.querySelector('.corporate-info-box').style.display === 'block';
    if (isCorporate) {
        disabledContinue(true);
        if (hasNitLength()) validateNit();
    } else {
        disabledContinue(false, false, true);
    }
}

const disabledContinue = (disabled, length = true, validated = false) => {
    document.querySelector('#go-to-shipping').disabled = disabled;
    document.querySelector('#go-to-payment').disabled = disabled;
    if (length) {
        showHelperText('El Nit debe contener 10 dígitos.', 'red');
    } else if (!validated) {
        showHelperText('Debe ingresar un Nit válido.', 'red');
    } else {
        showHelperText('Ha ingresado un Nit válido', 'blue');
    }
}

const showHelperText = (message, color = 'red') => {
    if (document.querySelector('#helper-nit'))
        document.querySelector('#helper-nit').remove();
    const p = document.querySelector('.client-company-ie');
    const span = document.createElement('span');
    span.setAttribute('id', 'helper-nit');
    span.innerText = message;
    p.appendChild(span);
    span.style.color = color;
}

const hasNitLength = () => {
    return document.querySelector('#client-company-ie')?.value?.length === 10 || false;
}

const validateNit = () => {
    const nitFull = document.querySelector('#client-company-ie')?.value;
    if(nitFull.length !== 10) {
        disabledContinue(true, true);
        return;
    }
    const nit = nitFull?.substring(0,9);
    const verificationDigit = parseInt(nitFull?.substring(9,10));
    const calculatedVerificationDigit = calculateVerificationDigit(nit);
    if (verificationDigit === calculatedVerificationDigit) {
        disabledContinue(false, false, true);
        return;
    }
    disabledContinue(true, false, false);
}

const calculateVerificationDigit = nit => {
    let primes, x, y, z;

    nit = nit.replace ( /\s/g, "" );
    nit = nit.replace ( /,/g,  "" );
    nit = nit.replace ( /\./g, "" );
    nit = nit.replace ( /-/g,  "" );

    if  ( isNaN ( nit ) )  {
        disabledContinue(true, false, false);
        return -1;
    }

    primes = new Array(16) ;
    primes[1]  =  3;
    primes[2]  =  7;
    primes[3]  = 13;
    primes[4]  = 17;
    primes[5]  = 19;
    primes[6]  = 23;
    primes[7]  = 29;
    primes[8]  = 37;
    primes[9]  = 41;
    primes[10] = 43;
    primes[11] = 47;
    primes[12] = 53;
    primes[13] = 59;
    primes[14] = 67;
    primes[15] = 71;

    z = nit.length ;

    x = 0 ;
    y = 0 ;
    for  ( let i = 0; i < z; i++ )  {
        y = ( nit.substr (i, 1 ) );

        x += ( y * primes [z-i] );
    }

    y = x % 11 ;

    return ( y > 1 ) ? 11 - y : y ;
}
