function performInputValidation(){
    if(document.getElementById("binanceapikey").value == ""){
        alert("Api key giriniz!");
        $("#botSwitch").bootstrapToggle("kapali");
        throw new Error("Api key giriniz!");
    }
    if(document.getElementById("binanceseckey").value == ""){
        alert("Secret Api key giriniz");
        $('#botSwitch').bootstrapToggle('kapali');
        throw new Error('Secret Api key giriniz');
     }
     if(!parseFloat(document.getElementById("qty").value)){
        alert("Miktar giriniz!");
        $('#botSwitch').bootstrapToggle('kapali');
        throw new Error('Miktar giriniz!');
     }
     if(!parseFloat(document.getElementById("profitprice").value)){
        alert("kâr fiyatını giriniz!");
        $('#botSwitch').bootstrapToggle('kapali');
        throw new Error('kâr fiyatını giriniz!');
     }
     if(!parseFloat(document.getElementById("stoplossprice").value)){
        alert("Stop-Loss Fiyat giriniz!");
        $('#botSwitch').bootstrapToggle('kapali');
        throw new Error('Stop-Loss Fiyat giriniz!');
     }
}

function disableInputFields(){   
    document.getElementById("binanceapikey").disabled = true;    
    document.getElementById("binanceseckey").disabled = true;    
    document.getElementById("symbol").disabled = true;    
    document.getElementById("qty").disabled = true;    
    document.getElementById("profitprice").disabled = true;    
    document.getElementById("stoplossprice").disabled = true;    
    document.getElementById("preference").disabled = true;  
}

function enableInputFields(){    
    document.getElementById("binanceapikey").disabled = false;    
    document.getElementById("binanceseckey").disabled = false;    
    document.getElementById("symbol").disabled = false;    
    document.getElementById("qty").disabled = false;    
    document.getElementById("profitprice").disabled = false;    
    document.getElementById("stoplossprice").disabled = false;    
    document.getElementById("preference").disabled = false; 
}

function saveSettings(){
    localStorage.setItem("binocobinanceapikey", document.getElementById("binanceapikey").value);
    localStorage.setItem("binocobinanceseckey", document.getElementById("binanceseckey").value);
    localStorage.setItem("binocosymbol", document.getElementById("symbol").value);
    localStorage.setItem("binocoqty", document.getElementById("qty").value);
    localStorage.setItem("binocoprofitprice", document.getElementById("profitprice").value);
    localStorage.setItem("binocostoplossprice", document.getElementById("stoplossprice").value);
    localStorage.setItem("binocopreference", document.getElementById("preference").value);
    alert("Ayarlar kaydedildi!");
}

function loadSettings(){
    document.getElementById("binanceapikey").value = localStorage.getItem("binocobinanceapikey");
    document.getElementById("binanceseckey").value = localStorage.getItem("binocobinanceseckey");
    document.getElementById("symbol").value = localStorage.getItem("binocosymbol");
    document.getElementById("qty").value = localStorage.getItem("binocoqty");
    document.getElementById("profitprice").value = localStorage.getItem("binocoprofitprice");
    document.getElementById("stoplossprice").value = localStorage.getItem("binocostoplossprice");
    document.getElementById("preference").value = localStorage.getItem("binocopreference");
    alert("kaydedilen Ayarlar yüklendi!");
}