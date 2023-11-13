/**
 * (c) Cuddly 2023 All Rights Reserved.
 */


// url of api
const url_api = "http://127.0.0.1:5500/data.json";

// get json data from url and execute callback
async function getData(url, callback) {
    const response = await fetch(url);
    const data = await response.json();
    callback(data["종량제봉투판매소정보"], (value)=> {return true});
}

// show data (callback of getData)
function showData(data, filter) {
    document.querySelector('#local').innerHTML = '';
    document.querySelector('#table1').innerHTML = '';
    //alert(filter);
    const cnt = data.length;
    let local1 = []; // 동 담기
    let local2 = {}; // 동별 세부 주소 담기
    for(var i = 0; i < cnt; i ++) {
        if(!local1.includes(data[i]["동선택"])) {
            local1.push(data[i]["동선택"]);
            local2[data[i]["동선택"]] = [];
        }
        let local3 = data[i]["도로명 주소"].split(' ');
        if(local3.length > 2) {
            local2[data[i]["동선택"]].push(local3[1]);
        } else {
            local2[data[i]["동선택"]].push(local3[0]);
        }
        //document.querySelector('#table1').innerHTML += `<tr><td>${data["종량제봉투판매소정보"][i]["동선택"]}</td><td>${data["종량제봉투판매소정보"][i]["지정판매소명"]}</td><td>${data["종량제봉투판매소정보"][i]["도로명 주소"]}</td><td>${data["종량제봉투판매소정보"][i]["판매소 전화번호"]}</td></tr>`
    }
    const data_filtered = data.filter(filter);
    const cnt_filtered = data_filtered.length;
    for(var i = 0; i < cnt_filtered; i ++) {
        document.querySelector('#table1').innerHTML += `<tr><td>${data_filtered[i]["동선택"]}</td><td>${data_filtered[i]["지정판매소명"]}</td><td>${data_filtered[i]["도로명 주소"]}</td><td>${data_filtered[i]["판매소 전화번호"]}</td></tr>`
    }
    // 지역 띄우기
    for(var j = 0; j < local1.length; j ++) {
        let html = `<option value="${j},*" selected>${local1[j]}</option>`;
        for(var k = 0; k < local2[local1[j]].length; k ++) {
            html += `<option value="${j},${k}">${local2[local1[j]][k]}</option>`;
        }
        document.querySelector('#local').innerHTML += `<select>${html}</select>`;
    }
    // select 옵션 선택될 때
    let select = document.querySelectorAll('select');
    for(var i = 0; i < select.length; i ++) {
        let current = select[i];
        current.onchange = function() {
            let current_val = current.value.split(',');
            if(current_val[1] == "*") {
                document.querySelector('#localText').innerHTML = local1[parseInt(current_val[0])];
                showData(data, function(value) { return value["도로명주소"] == local1[parseInt(current_val[0])]; });
            } else {
                document.querySelector('#localText').innerHTML = local2[local1[parseInt(current_val[0])]][parseInt(current_val[1])];
                showData(data, function(value) {return value["동선택"] == local1[parseInt(current_val[0])] && value["도로명 주소"].includes(local2[local1[parseInt(current_val[0])]][parseInt(current_val[1])]); });
            }
            
        }
    }
}

getData(url_api, showData);