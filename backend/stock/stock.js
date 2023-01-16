const yahooFinance2 = require('yahoo-finance2').default;

const trimString = (s)=>{
    var l=0, r=s.length -1;
    while(l < s.length && s[l] == ' ') l++;
    while(r > l && s[r] == ' ') r-=1;
    return s.substring(l, r+1);
}

const compareObjects = (o1, o2)=>{
    var k = '';
  for(k in o1) if(o1[k] != o2[k]) return false;
  for(k in o2) if(o1[k] != o2[k]) return false;
  return true;
}
const itemExists = (haystack, needle)=>{
    for(var i=0; i<haystack.length; i++) if(compareObjects(haystack[i], needle)) return true;
  return false;
}

const SearchObj= async (req, res)=>{
    let url = 'http://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=25&offset=0&exchange=%s&download=true';
    fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        let objects = myJson.data.rows;
        
        var results = [];
        const toSearch = trimString(req.body.search); // trim it
          for(var i=0; i<objects.length; i++) {
            for(var key in objects[i]) {
              if(objects[i][key].indexOf(toSearch)!=-1) {
                if(!itemExists(results, objects[i])) results.push(objects[i]);
              }
            }
          }
          res.send(results);
        
    });
}
const SearchArray = async(req, res)=>{
  let url = 'http://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=25&offset=0&exchange=%s&download=true';
    fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(myJson) {
        let objects = myJson.data.rows;
        var results = [];
        const data = req.body.search; // trim it
        
        for(var j=0; j<data.length; j++){
          const toSearch = trimString(data[j])
          console.log(toSearch)
          for(var i=0; i<objects.length; i++) {
            for(var key in objects[i]) {
              if(objects[i][key].indexOf(toSearch)!=-1) {
                if(!itemExists(results, objects[i])) results.push(objects[i]);
              }
            }
          }
        }
          res.send(results);
        
    });
}

 module.exports =  {SearchObj, SearchArray};