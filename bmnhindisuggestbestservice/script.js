document.addEventListener('copy', function(e) {
  e.preventDefault();
  alert('इस पेज पर कॉपी करना अनुमति नहीं है।');
});

function validateForm() {
  const form = document.getElementById('questionnaire');
  const formData = new FormData(form);

  // Check if all questions are answered
  for (let [key, value] of formData.entries()) {
    if (value === "" && key.startsWith('q')) {
      alert("कृपया सभी प्रश्नों का उत्तर दें");
      return false;
    }
  }

  calculateScore(formData);
  return false; // Prevent the form from submitting normally
}

function calculateScore(formData) {
  // This function calculates the result and recommendation based on the form data
  let message = '';
  let recommendations = '';

  const q14Value = formData.get('q14');
  if (q14Value === 'Individual counseling for yourself') {
    message = 'हम व्यक्तिगत परामर्श की सिफारिश करते हैं: यदि आप अभिभूत, तनावग्रस्त, या व्यक्तिगत समर्थन की आवश्यकता महसूस कर रहे हैं।';
    recommendations = `
      <strong>क्या करें:</strong><br>
      - माइंडफुलनेस और विश्राम तकनीकों का अभ्यास करें।<br>
      - नियमित व्यायाम के साथ एक स्वस्थ जीवन शैली बनाए रखें।<br>
      - एक सुसंगत दैनिक दिनचर्या स्थापित करें।<br><br>
      <strong>क्या न करें:</strong><br>
      - अत्यधिक कैफीन या शक्कर का सेवन न करें।<br>
      - खुद को अलग न करें; दोस्तों और परिवार के साथ जुड़े रहें।<br>
      - लगातार तनाव या चिंता की अनदेखी न करें; यदि आवश्यक हो तो सहायता प्राप्त करें।`;
  } else if (q14Value === 'Family counseling for the whole family') {
    message = 'हम परिवार परामर्श की सिफारिश करते हैं: यदि परिवार में बार-बार संघर्ष या संचार समस्याएं होती हैं।';
    recommendations = `
      <strong>क्या करें:</strong><br>
      - मुद्दों पर चर्चा और समाधान के लिए नियमित पारिवारिक बैठकें आयोजित करें।<br>
      - सक्रिय सुनने और सहानुभूति का अभ्यास करें।<br>
      - पारिवारिक बंधन गतिविधियों में भाग लें।<br><br>
      <strong>क्या न करें:</strong><br>
      - परिवार के सदस्यों को दोषी या शर्मिंदा न करें।<br>
      - किसी भी परिवार के सदस्य की भावनात्मक आवश्यकताओं की उपेक्षा न करें।<br>
      - मुद्दों को अनदेखा न करें; उन्हें खुले तौर पर संबोधित करें।`;
  } else if (q14Value === 'Child or adolescent counseling') {
    message = 'हम बच्चे या किशोर परामर्श की सिफारिश करते हैं: यदि आपका बच्चा व्यवहारिक समस्याओं या भावनात्मक संकट का सामना कर रहा है।';
    recommendations = `
      <strong>क्या करें:</strong><br>
      - एक सहायक और समझने वाला वातावरण प्रदान करें।<br>
      - भावनाओं के बारे में खुली बातचीत को प्रोत्साहित करें।<br>
      - अनुशासन के साथ धैर्य रखें और सुसंगत रहें।<br><br>
      <strong>क्या न करें:</strong><br>
      - अपने बच्चे की भावनाओं या चिंताओं को खारिज न करें।<br>
      - अपने बच्चे की तुलना दूसरों से न करें।<br>
      - अपनी खुद की भावनात्मक भलाई की उपेक्षा न करें; बच्चे अक्सर अपने माता-पिता की भावनाओं को प्रतिबिंबित करते हैं।`;
  } else if (q14Value === 'Anonymous counseling services') {
    message = 'हम गुमनाम परामर्श की सिफारिश करते हैं: यदि आप अपनी पहचान प्रकट किए बिना अपनी चिंताओं पर चर्चा करना पसंद करते हैं।';
    recommendations = `
      <strong>क्या करें:</strong><br>
      - अपनी चिंताओं के बारे में ईमानदार और खुला रहें।<br>
      - परामर्श सत्रों का उपयोग अपनी भावनाओं का पता लगाने के लिए करें।<br>
      - दिए गए सलाह और रणनीतियों का पालन करें।<br><br>
      <strong>क्या न करें:</strong><br>
      - डर या शर्म के कारण महत्वपूर्ण जानकारी न छिपाएं।<br>
      - सत्रों को छोड़ें नहीं; सुसंगतता महत्वपूर्ण है।<br>
      - प्रदान की गई सलाह की अनदेखी न करें; सुधार की दिशा में सक्रिय कदम उठाएं।`;
  }

  message += `<br><br>${recommendations}`;
  message += "<br><br><strong>आगे की सलाह के लिए अपने मनोवैज्ञानिक नेविगेटर से connect@thelifenavigator.com पर संपर्क करें।</strong>";
  message += "<br><br><strong>अस्वीकरण:</strong> उपयोगकर्ताओं द्वारा दी गई जानकारी के आधार पर प्रदान की गई सिफारिशें हैं। हम दवाएं नहीं लिखते हैं या आपातकालीन स्वास्थ्य सेवाएं प्रदान नहीं करते हैं।";

  openResultWindow(message);

  // Send data to Google Sheets
  backupData(formData);
}

function openResultWindow(message) {
  const newWindow = window.open("", "_blank", "width=600,height=400");
  newWindow.document.write(`
    <html>
      <head>
        <title>परिणाम</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #87CEEB;
            margin: 0;
            padding: 20px;
            text-align: center;
          }
          .result-container {
            border: 10px solid transparent;
            padding: 15px;
            border-image: url('https://www.publicdomainpictures.net/pictures/10000/velka/1433-1249134241Z21z.jpg') 30;
            border-radius: 15px;
            background-color: #fff;
          }
          h1 {
            color: #333;
          }
          p {
            color: #555;
          }
          .bold {
            font-weight: bold;
          }
          .back-button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            border: none;
            background-color: #007BFF;
            color: white;
            font-size: 16px;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
          }
          .back-button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="result-container">
          <h1>मनोवैज्ञानिक सेवाएं अनुशंसा</h1>
          <p>${message}</p>
          <a class="back-button" href="https://www.thelifenavigator.com">मुख्य पृष्ठ पर वापस जाएं</a>
        </div>
      </body>
    </html>
  `);
}

function backupData(formData) {
  const scriptURL = "https://script.google.com/macros/s/AKfycbx9PoV42pXHSr4LrGA9cnvV7v0MUFNWOBEyHuF-E5u2QlNtpoanTc-x1x5iAy-Rsjgipg/exec"; // Replace with your Apps Script URL
  const data = new URLSearchParams();

  for (let [key, value] of formData.entries()) {
    data.append(key, value);
  }

  fetch(scriptURL, {
    method: 'POST',
    mode: 'no-cors',
    body: data
  }).then(response => {
    console.log('Data sent to Google Sheets');
  }).catch(error => {
    console.error('Error sending data to Google Sheets:', error);
  });
}
