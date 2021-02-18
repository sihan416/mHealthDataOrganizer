const fileSelector = document.getElementById('customFile');
  fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
  });

var convertedFile = null;

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function downloadHandler(){
  download("result.json", convertedFile);
}

function clickHandler() {
  var progress = document.getElementById("in-progress");
  var download = document.getElementById("download");
  var meal = document.getElementById("meal").checked;
  var sleep = document.getElementById("sleep").checked;
  var timeframe = document.getElementById("timeframe").checked;
  var description = document.getElementById("description").checked;
  if (fileSelector.files.length > 0 && fileSelector.files[0].type == "application/json"){
    progress.style.display = "block";
    fileSelector.files[0].text().then((txt)=>{
      try{
        var parsed = JSON.parse(txt);
        var validEntries = [];
        if (document.getElementById('data-type').value == "blood-glucose"){
          if (Array.isArray(parsed)){
            parsed.forEach((element) => {
              var valid = true;
              if (!element.blood_glucose){
                valid = false;
              }
              if (meal && !element.temporal_relationship_to_meal) {
                valid = false;
              }
              if (sleep && !element.temporal_relationship_to_sleep) {
                valid = false;
              }
              if (timeframe && !(element.effective_time_frame && element.effective_time_frame.time_interval)) {
                valid = false;
              }
              if (description && !element.descriptive_statistic) {
                valid = false;
              }
              if (valid){
                validEntries.push(element);
              }
            });
          } else {
            var valid = true;
            if (!parsed.blood_glucose){
              valid = false;
            }
            if (meal && !parsed.temporal_relationship_to_meal) {
              valid = false;
            }
            if (sleep && !parsed.temporal_relationship_to_sleep) {
              valid = false;
            }
            if (timeframe && !(parsed.effective_time_frame && parsed.effective_time_frame.time_interval)) {
              valid = false;
            }
            if (description && !parsed.descriptive_statistic) {
              valid = false;
            }
            if (valid){
              validEntries.push(parsed);
            }
          }
        }
        convertedFile = JSON.stringify(validEntries);
        download.style.display = "block";
      }
      catch(err){
        alert("Uploaded JSON file data is in corrupted state");
      }
      progress.style.display = "none";
    }
  );
  } else if (fileSelector.files.length == 0){
    alert("No file uploaded");
  } else {
    alert("Uploaded file is not in JSON format");
  }
}

function dataTypeChange() {
  var download = document.getElementById("download");
  download.style.display = "none";
  var BGelement = document.getElementById("blood-glucose-options");
  var dataType = document.getElementById('data-type').value;
  if (dataType == "blood-glucose"){
    BGelement.style.display = "block";
  } else {
    BGelement.style.display = "none";
  }
}

function readImage(file) {

  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    img.src = event.target.result;
  });
  reader.readAsDataURL(file);
}
