//eğer tercih Kârı Al mak ise. bot açıkken, kâr alma fiyatına bir sınırlama emri verin
//
//fiyatın üstüne çıkması durumunda, kâr elde edin, durumu güncelleyin ve çıkın
//eğer fiyat, stop-loss'un altına düşerse. Ardından limit emrini iptal edin ve bir piyasa emri verin
//tercih, zararı durdurma ise,bot açıkken, stop-stop fiyatına bir stop-limit emri verin
//eğer fiyat stop-loss'un altına düşerse. ardından durumu güncelleyin ve çıkın
//eğer fiyat artarsa, kar fiyatı alın. sonra stop-loss emrini iptal edin ve piyasa emri verin

const api = require('binance');

calistirWebSockets();
var sj_sembol={};

function calistirWebSockets(){
    const binanceWS = new api.BinanceWS(true);
    binanceWS.onAllTickers((data) => {
        for(y=0;y<data.length;y++){
            sj_sembol[data[y]["symbol"]] = {
                "sembol" : data[y]["symbol"],
                "ei_teklif" : data[y]["bestBid"],
                "fiyat_sor" : data[y]["bestAskPrice"],
                "kapanis" : data[y]["currentClose"],
            };
        }
    });
}


function girisDogrulamasiGerceklestir(){
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

function ayarlariKaydet(){
    localStorage.setItem("binocobinanceapikey", document.getElementById("binanceapikey").value);
    localStorage.setItem("binocobinanceseckey", document.getElementById("binanceseckey").value);
    localStorage.setItem("binocosymbol", document.getElementById("symbol").value);
    localStorage.setItem("binocoqty", document.getElementById("qty").value);
    localStorage.setItem("binocoprofitprice", document.getElementById("profitprice").value);
    localStorage.setItem("binocostoplossprice", document.getElementById("stoplossprice").value);
    localStorage.setItem("binocopreference", document.getElementById("preference").value);
    alert("Ayarlar kaydedildi!");
}

function kAyarlariYukle(){
    document.getElementById("binanceapikey").value = localStorage.getItem("binocobinanceapikey");
    document.getElementById("binanceseckey").value = localStorage.getItem("binocobinanceseckey");
    document.getElementById("symbol").value = localStorage.getItem("binocosymbol");
    document.getElementById("qty").value = localStorage.getItem("binocoqty");
    document.getElementById("profitprice").value = localStorage.getItem("binocoprofitprice");
    document.getElementById("stoplossprice").value = localStorage.getItem("binocostoplossprice");
    document.getElementById("preference").value = localStorage.getItem("binocopreference");
    alert("kaydedilen Ayarlar yüklendi!");
}
function ilkSiparis(){
    
    //borsa hesap bilgi alma yeri
    binanceRest = new api.BinanceRest({
        key: document.getElementById("binanceapikey").value, //api key binance kendi sitesinden
        secret: document.getElementById("binanceseckey").value, // api secret key binance kendi sitesinden
        timeout: 15000, // istege bagli, default 15000, milisaniye olarak ayarlandı
        recvWindow: 10000, // istege bagli, default 5000, zaman damgası hatası(timestamp errors) alıyorsam arttır
        disableBeautification: false,
        handleDrift: true
    });
    
    if(sj_trade["preference"] == 1){//1 - kârı Al
        binanceRest.exchangeInfo()
        .then((r1) => {
            //normal fiyat ve miktar
            var yd_mkt1 = sj_trade["qty"];
            var yd_mkt;
            var yd_fyt1 = sj_trade["profitprice"];
            var yd_fyt;

            for(m=0;m<r1["symbols"].length;m++){
                if(r1["symbols"][m]["symbol"] == sj_trade["symbol"]){
                  var yd_stepsize = Math.log10(1/parseFloat(r1["symbols"][m]["filters"][2]["stepSize"]));
                  var yd_ticksize = Math.log10(1/parseFloat(r1["symbols"][m]["filters"][0]["tickSize"]));
                  yd_mkt = Math.floor(yd_mkt1 * 10**yd_stepsize)/10**yd_stepsize;
                  yd_fyt = Math.floor(yd_fyt1 * 10**yd_ticksize)/10**yd_ticksize;
                }
            }

          //tercihe gore siparis yeri
          return binanceRest.newOrder({
                                    symbol: sj_trade["symbol"],
                                    side: 'SELL',
                                    type: 'LIMIT',
                                    quantity: yd_mkt,
                                    price: yd_fyt,
                                    timeInForce: "GTC",
                                    newOrderRespType: 'RESULT',
                                })

        }).then((r2) => {
            sj_trade["binanceid"] = r2["clientOrderId"];
            //durumu guncelle
            document.getElementById("tpstatus").innerHTML = '<h4 class="bg-warning">Kârı Al yerleştirildi</h4>';
            
        }).catch((err) => {
            console.error(err);
        }); 
    }
    else{//stop Loss
        binanceRest.exchangeInfo()
        .then((r1) => {
            //normal fiyat ve miktar
            var yd_mkt1 = sj_trade["qty"];
            var yd_mkt;
            var yd_fyt1 = sj_trade["stoplossprice"];
            var yd_fyt;

            for(m=0;m<r1["symbols"].length;m++){
                if(r1["symbols"][m]["symbol"] == sj_trade["symbol"]){
                  var yd_stepsize = Math.log10(1/parseFloat(r1["symbols"][m]["filters"][2]["stepSize"]));
                  var yd_ticksize = Math.log10(1/parseFloat(r1["symbols"][m]["filters"][0]["tickSize"]));
                  yd_mkt = Math.floor(yd_mkt1 * 10**yd_stepsize)/10**yd_stepsize;
                  yd_fyt = Math.floor(yd_fyt1 * 10**yd_ticksize)/10**yd_ticksize;
                }
            }

          //tercihe gore siparis yeri
          return binanceRest.newOrder({
                                    symbol: sj_trade["symbol"],
                                    side: 'SELL',
                                    type: 'STOP_LOSS_LIMIT',
                                    quantity: yd_mkt,
                                    stopPrice: yd_fyt,
                                    price: yd_fyt,
                                    timeInForce: "GTC",
                                    newOrderRespType: 'RESULT',
                                })

        }).then((r2) => {
            sj_trade["binanceid"] = r2["clientOrderId"];
            //durumu guncelle
            document.getElementById("slstatus").innerHTML = '<h4 class="bg-warning">Zararı Durdur yerleştirildi</h4>';
            
        }).catch((err) => {
            console.error(err);
        }); 
    }
}
function suankiDurumKontrol(){
    var yd_sym = sj_sembol[sj_trade["symbol"]];
    document.getElementById("formstatus").innerHTML = '<div class="row"><h4 class="bg-warning">Mevcut fiyat: ' + yd_sym["close"] + '</h4></div>'; 
    if(sj_trade["preference"] == 1){//Kâr al, zararı durdur
       if(yd_sym["close"] <= sj_trade["stoplossprice"]){ticaretCikis();};//eger fiyat duserse, zararı durdur
       if(yd_sym["close"] > sj_trade["profitprice"]){
           document.getElementById("tpstatus").innerHTML = '<h4 class="bg-success text-white">Kârı Al emri verildi!</h4>';
           $('#botSwitch').bootstrapToggle('off');//eger fiyat yukselmisse, kar al
       }
    }
    else{//Kaybı Durdur, kar al
       if(yd_sym["close"] >= sj_trade["profitprice"]){ticaretCikis();}//eger fiyat yukselmisse, kar al
       if(yd_sym["close"] < sj_trade["stoploss"]){
           document.getElementById("slstatus").innerHTML = '<h4 class="bg-danger text-white">Zararı durdur emri verildi!</h4>';
           $('#botSwitch').bootstrapToggle('off');//eger fiyat duserse, zararı durdur
       }
    }
}
function ticaretCikis(){
    
    //siparisi iptal et
    binanceRest = new api.BinanceRest({
        key: document.getElementById("binanceapikey").value, //api key binance kendi sitesinden
        secret: document.getElementById("binanceseckey").value, // api secret key binance kendi sitesinden
        timeout: 15000, // istege bagli, default 15000, milisaniye olarak ayarlandı
        recvWindow: 10000, // istege bagli, default 5000, zaman damgası hatası(timestamp errors) alıyorsam arttır
        disableBeautification: false,
        handleDrift: true
    });
    
    binanceRest.cancelOrder({
                                symbol: sj_trade["symbol"],
                                origClientOrderId: sj_trade["binanceid"],
                            }).
    then((r11) => {
       
    //borsadan bilgileri donderme, alma
    return binanceRest.exchangeInfo();    
        
    }).
    then((r1) => {
        //normal miktar
        var yd_mkt1 = sj_trade["qty"];
        var yd_mkt;

        for(m=0;m<r1["symbols"].length;m++){
            if(r1["symbols"][m]["symbol"] == gv_trade["symbol"]){
              var yd_stepsize = Math.log10(1/parseFloat(r1["symbols"][m]["filters"][2]["stepSize"]));
              yd_mkt = Math.floor(yd_mkt1 * 10**lv_stepsize)/10**lv_stepsize;
            }
        }

      //piyasa siparis yeri
      return binanceRest.newOrder({
                                symbol: sj_trade["symbol"],
                                side: 'SELL',
                                type: 'MARKET',
                                quantity: yd_mkt,
                                newOrderRespType: 'RESULT',
                            }) 
        
    }).
    then((r2) => {
        //durum guncelleme
        if(sj_trade["preference"] == 1){
           document.getElementById("tpstatus").innerHTML = '<h4 class="bg-danger text-white">Kârı Al emri iptal edildi!</h4>';
           document.getElementById("slstatus").innerHTML = '<h4 class="bg-danger text-white">Zararı durdur emri verildi!</h4>';
        }
        else{
           document.getElementById("tpstatus").innerHTML = '<h4 class="bg-success text-white">Kârı Al emri verildi!</h4>';
           document.getElementById("slstatus").innerHTML = '<h4 class="bg-success text-white">Zararı durdur emri iptal edildi!</h4>'; 
        }
        //bot kapat
        $('#botSwitch').bootstrapToggle('off');
        
    }).
    catch((err) => {
        console.error(err);
    });

}