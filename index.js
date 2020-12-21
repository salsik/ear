const rp = require('request-promise-native');
const fs = require('fs');

const cheerio = require('cheerio');



async function downloadEarthquakesHtml() {
  // where to download the HTML from
  const uri = 'https://earthquaketrack.com/p/japan/recent';
   // the output filename
  const filename = 'earthquakes.html';
  // download the HTML from the web server
  console.log('Downloading HTML from ${uri}...');
  const results = await rp({ uri: uri });
  // save the HTML to disk
  await fs.promises.writeFile(filename, results);
}


async function parseEarthquakes1() {
	
  console.log('Parsing earth quakes HTML...');
  // the input filename
  const htmlFilename = 'earthquakes.html';
  // read the HTML from disk
  const html = await fs.promises.readFile(htmlFilename);
  // parse the HTML with Cheerio
  const $ = cheerio.load(html);
  // Get our rows
  const $trs = $('.gamepackage-away-wrap tbody tr:not(.highlight)');
  const values = $trs.toArray().map(tr => {
    // find all children <td>
    const tds = $(tr).find('td').toArray();
    // create a player object based on the <td> values
    const player = {};
    for (td of tds) {
      const $td = $(td);
      // map the td class attr to its value
      const key = $td.attr('class');
      let value;
      if (key === 'name') {
        value = $td.find('a span:first-child').text();
      } else {
        value = $td.text();
      }
      player[key] = isNaN(+value) ? value : +value;
    }
    return player;
  });
  return values;
}




async function parseEarthquakes() {
	
  console.log('Parsing earth quakes HTML...');
  // the input filename
  const htmlFilename = 'earthquakes.html';
  // read the HTML from disk
  const html = await fs.promises.readFile(htmlFilename);
  // parse the HTML with Cheerio
  const $ = cheerio.load(html);
  // Get our rows
  //const $trs = $html.getElementsByClassName("quiet row");
  
  const $trs = $('.quiet');
  
  console.log("--------------------------");
  
  console.log ($trs.length);
  const values = $trs.toArray().map(tr => {
    
	
    
	
	const title = $(tr).find('abbr').attr("title");
	
	//const degree =$(trs[0]).find('.text-danger').text()
	
	
	let degree =$(tr).find('.text-danger').text()
	
	if (degree=="")
		degree = $(tr).find('.text-warning').text() + " (warning) " ;
	else
		degree += " (danger) " ;
	
	const city =$(tr).find('a:nth-child(4)').text()
	const prefecture =$(tr).find('a:nth-child(5)').text()
	const country =$(tr).find('a:nth-child(6)').text()
	
	console.log(title);
	console.log(degree);
	console.log(city);
	console.log(prefecture);
	console.log(country);
	console.log("--------------------------");
	
	const quake = {};
	
	
	quake.time = title ;
	quake.degree = degree ;
	quake.city = city ;
	quake.prefecture = prefecture ;
	quake.country = country ;
	
    return quake;
	
	

  });
  
  
  return values;
}



async function main() {
  console.log('Starting...');
  
  
  await downloadEarthquakesHtml();
  
  const earthquakes = await parseEarthquakes();
  // save the scraped results to disk
  await fs.promises.writeFile(
    'earthquakes.json',
    JSON.stringify(earthquakes, null, 2)
  );
  
  
  console.log('Done!');
}
main();