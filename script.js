  
  <script>
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
      let score = 0;

      for (let [key, value] of formData.entries()) {
        if (key.startsWith('q')) { // Only process the questionnaire answers
          score += parseInt(value);
        }
      }

      let message = '';
      if (score <= 18) {
        message = 'Minimal anxiety. You are managing your stress well.';
      } else if (score <= 27) {
        message = 'Mild anxiety. Consider adopting relaxation techniques.';
      } else if (score <= 36) {
        message = 'Moderate anxiety. It is advisable to talk to a counselor.';
      } else {
        message = 'Severe anxiety. Seek professional help immediately.';
      }

      message += "\n\nDo's:\n- Practice mindfulness and relaxation techniques.\n- Maintain a healthy lifestyle with regular exercise.\n- Establish a consistent study routine.\n\nDon'ts:\n- Avoid excessive caffeine or sugar intake.\n- Don't isolate yourself; stay connected with friends and family.\n- Don't ignore persistent anxiety; seek help if needed.";

      document.getElementById('result').innerText = message;
      alert(message);

      // Send data to Google Sheets
      backupData(formData);
    }

    function backupData(formData) {
      const scriptURL = "https://script.google.com/macros/s/AKfycbx_5Zp_svgDHx_A0BSsJGmNvkA5qyzxUXJ4jmRz8ceSsi_SfKmYEQD-NRWU9P1GCA/exec"; // Replace with your Apps Script URL
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
  </script>
</body>
</html>
