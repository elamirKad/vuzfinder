const fs = require('fs');
const http = require('http');
const url = require('url');


const replaceTemplate = (temp, vuzItem) => {
    let output = temp.replace(/{%NAME%}/g, vuzItem.name);
    output = output.replace(/{%DESC%}/g, vuzItem.desc);
    output = output.replace(/{%SAT%}/g, vuzItem.sat);
    output = output.replace(/{%IELTS%}/g, vuzItem.ielts);
    output = output.replace(/{%TOEFL%}/g, vuzItem.toefl);
    output = output.replace(/{%GPA%}/g, vuzItem.gpa);
    output = output.replace(/{%UNPRICE%}/g, vuzItem.unprice);
    output = output.replace(/{%MAGPRICE%}/g, vuzItem.magprice);
    output = output.replace(/{%ID%}/g, vuzItem.id);
    output = output.replace(/{%SITE%}/g, vuzItem.site);
    output = output.replace(/{%DOCS%}/g, vuzItem.docs);
    output = output.replace(/{%DIRS%}/g, vuzItem.dirs);
    output = output.replace(/{%ADM%}/g, vuzItem.adm);
    output = output.replace(/{%IMG%}/g, vuzItem.img);

    if(vuzItem.finaid){
        output = output.replace(/{%FINAID%}/g, 'Yes');
    }else{
        output = output.replace(/{%FINAID%}/g, 'No');
    }

    return output;
}
const sorting = (temp, vuzItem, quer) =>{
    if(vuzItem.sat <= quer.sat || quer.sat == 0){
        if(vuzItem.gpa <= quer.gpa || quer.gpa == 0){
            if(vuzItem.ielts <= quer.ielts || quer.ielts == 0){
                if(vuzItem.toefl <= quer.toefl || quer.toefl == 0){
                    output = replaceTemplate(temp, vuzItem);
                    return output;
                }
            }
        }
    }
    return '';
}



const data = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const tempMain = fs.readFileSync(`${__dirname}/templ/main.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templ/card.html`, 'utf-8');
const tempSearch = fs.readFileSync(`${__dirname}/templ/search.html`, 'utf-8');
const tempVuz = fs.readFileSync(`${__dirname}/templ/vuz.html`, 'utf-8');
const tempHead = fs.readFileSync(`${__dirname}/templ/head.html`, 'utf-8');
const tempNav = fs.readFileSync(`${__dirname}/templ/nav.html`, 'utf-8');

const server = http.createServer((req, res) =>{
    const {query, pathname} = url.parse(req.url, true);
    if(pathname === '/' || pathname === '/main'){
        res.writeHead(200, {'Content-type': 'text/html'});

        var output = tempMain;
        output = output.replace('{%HEAD%}', tempHead);
        output = output.replace('{%NAV%}', tempNav);

        res.end(output);
    }else if(pathname === '/search'){
        res.writeHead(200, {'Content-type': 'text/html'});

        const cardsHtml = dataObj.map(el => sorting(tempCard, el, query)).join('');
        var output = tempSearch.replace('{%CARDS%}', cardsHtml);
        output = output.replace('{%HEAD%}', tempHead);
        output = output.replace('{%NAV%}', tempNav);

        res.end(output);
    }else if(pathname === '/vuz'){
        res.writeHead(200, {'Content-type': 'text/html'});
        
        const vuzItem = dataObj[query.id];
        var output = replaceTemplate(tempVuz, vuzItem);
        output = output.replace('{%HEAD%}', tempHead);
        output = output.replace('{%NAV%}', tempNav);
        res.end(output);
    }else{
        res.writeHead(404, {
            'Content-type': 'text/html'
        });
        res.end("<h1>Page not found!</h1>");
    }
    
});

server.listen(8000, '127.0.0.1', () =>{
    console.log("Listening 127.0.0.1:8000");
})
