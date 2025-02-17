import $ from 'jquery';
import exampleDiagram from './assets/exampleDiagram.xml';
import PnModeler from "ptn-js/lib/pnmodeler/PnModeler";
import "ptn-js/assets/pn-js.css";

const pnModeler = new PnModeler({
  container: document.querySelector('#pn-canvas')
});

async function createNewDiagram(diagram) {
  try {
    await pnModeler.importXML(diagram);
  } catch (err) {
      console.error(err);
  }
}

$(function() {
  createNewDiagram(exampleDiagram);
});

function download(name, data, encoding='charset=UTF-8') {
    var encodedData = encodeURIComponent(data);
    var link = document.createElement("a");
    document.body.appendChild(link);

    const fileType = name.split('.').pop();

    $(link).attr({
        'href': 'data:application/' + fileType + ';' + encoding + ',' + encodedData,
        'download': name
    });

    link.click();
    document.body.removeChild(link);
}

function upload(callback, encoding='UTF-8') {
    var fileInput = document.createElement("input");
    document.body.appendChild(fileInput);

    $(fileInput).attr({ 'type': 'file' }).on('change', function (e) {
        var file = e.target.files[0];
        var reader = new FileReader();
        if (encoding === 'base64') {
            reader.readAsDataURL(file);
        } else {
            reader.readAsText(file, encoding);
        }
        reader.onload = function (evt) {
            callback(evt.target.result);
        }
    }).trigger('click');

    document.body.removeChild(fileInput);
}

document.getElementById('newButton').addEventListener('click', () => pnModeler.createNew());

document.getElementById('openXmlButton').addEventListener('click', () => upload((data) => {
  importFromXmlFile(data);
}));

document.getElementById('openPnmlButton').addEventListener('click', () => upload((data) => {
  importFromPnmlFile(data);
}));

document.getElementById('saveXmlButton').addEventListener('click', () => exportXML().then(xml => {
  download('PetriNet.xml', xml);
}));

document.getElementById('savePnmlButton').addEventListener('click', () => exportPNML().then(pnml => {
  download('PetriNet.pnml', pnml);
}));

async function exportXML() {
  const pnXML = (await pnModeler.saveXML({format: true})).xml;
  return pnXML;
}

async function exportPNML() {
  const pnml = (await pnModeler.savePNML({format: true}));
  return pnml;
}

async function importFromXmlFile(file) {
  await pnModeler.importXML(file);
}

async function importFromPnmlFile(file) {
  await pnModeler.importPNML(file);
}

const canvas = document.getElementById("pn-canvas")
canvas.tabIndex = 0;
canvas.addEventListener('mouseenter', event => {
  if (document.activeElement.className !== 'djs-direct-editing-content') {
    canvas.focus();
  }
});
