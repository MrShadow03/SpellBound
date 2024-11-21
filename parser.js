const corsProxy = 'https://cors-anywhere.herokuapp.com/';
const url = `${corsProxy}https://www.merriam-webster.com/dictionary/destination`;

fetch(url)
  .then(response => response.text())
  .then(data => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');
    const title = doc.querySelector('title').textContent;
    console.log('Page Title:', title);
  })
  .catch(error => console.error('Error:', error));
