document.addEventListener('copy', function(e) {
  e.preventDefault();
  alert('Copying is not allowed on this page.');
});

function validateForm() {
  const form = document.getElementById('questionnaire');
  const formData = new FormData(form);

  // Check if all questions are answered
  for (let [key, value] of formData.entries()) {
    if (value === "" && key.startsWith('q')) {
      alert("Please answer all the questions");
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
    message = 'We recommend Individual Counseling: If you feel overwhelmed, stressed, or need personal support.';
    recommendations = `
      <strong>Do's:</strong><br>
      - Practice mindfulness and relaxation techniques.<br>
      - Maintain a healthy lifestyle with regular exercise.<br>
      - Establish a consistent daily routine.<br><br>
      <strong>Don'ts:</strong><br>
      - Avoid excessive caffeine or sugar intake.<br>
      - Don't isolate yourself; stay connected with friends and family.<br>
      - Don't ignore persistent stress or anxiety; seek help if needed.`;
  } else if (q14Value === 'Family counseling for the whole family') {
    message = 'We recommend Family Counseling: If there are frequent conflicts or communication issues within the family.';
    recommendations = `
      <strong>Do's:</strong><br>
      - Hold regular family meetings to discuss and resolve issues.<br>
      - Practice active listening and empathy.<br>
      - Engage in family bonding activities.<br><br>
      <strong>Don'ts:</strong><br>
      - Avoid blaming or shaming family members.<br>
      - Don't neglect the emotional needs of any family member.<br>
      - Avoid sweeping issues under the rug; address them openly.`;
  } else if (q14Value === 'Child or adolescent counseling') {
    message = 'We recommend Child or Adolescent Counseling: If your child is exhibiting behavioral problems or emotional distress.';
    recommendations = `
      <strong>Do's:</strong><br>
      - Provide a supportive and understanding environment.<br>
      - Encourage open communication about feelings.<br>
      - Be patient and consistent with discipline.<br><br>
      <strong>Don'ts:</strong><br>
      - Don't dismiss your child's feelings or concerns.<br>
      - Avoid comparing your child to others.<br>
      - Don't neglect your own emotional well-being; children often mirror their parents' emotions.`;
  } else if (q14Value === 'Anonymous counseling services') {
    message = 'We recommend Anonymous Counseling: If you prefer to discuss your concerns without revealing your identity.';
    recommendations = `
      <strong>Do's:</strong><br>
      - Be honest and open about your concerns.<br>
      - Use the counseling sessions to explore your feelings.<br>
      - Follow through with the advice and strategies provided.<br><br>
      <strong>Don'ts:</strong><br>
      - Don't withhold important information out of fear or shame.<br>
      - Avoid skipping sessions; consistency is key.<br>
      - Don't ignore the advice provided; take proactive steps towards improvement.`;
  }

  message += `<br><br>${recommendations}`;
  message += "<br><br><strong>Contact your Psychological Navigator at connect@thelifenavigator.com for further guidance.</strong>";
  message += "<br><br><strong>Disclaimer:</strong> The recommendations provided are based solely on the inputs given by the users. We do not prescribe medicines or provide emergency health services.";

  openResultWindow(message);

  // Send data to Google Sheets
  backupData(formData);
}

function openResultWindow(message) {
  const newWindow = window.open("", "_blank", "width=600,height=400");
  newWindow.document.write(`
    <html>
      <head>
        <title>Results</title>
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
          <h1>Psychological Services Recommendation</h1>
          <p>${message}</p>
          <a class="back-button" href="https://www.thelifenavigator.com">Back to Homepage</a>
        </div>
      </body>
    </html>
  `);
}

function backupData(formData) {
  const scriptURL = "https://script.google.com/macros/s/AKfycbzooLciDeyQO5mFjZUe_RKi3OwIa4eq0CGfhkOU1iuDUd0EptA7Rh8YBFBTaeuo9fj9Aw/exec"; // Replace with your Apps Script URL
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
