document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('startButton');
    const transcriptionDiv = document.getElementById('transcription');

    let recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onresult = function (event) {
        const result = event.results[event.results.length - 1][0].transcript;
        const normalizedResult = normalizeVoiceCommands(result);
        const filteredResult = filterArithmetic(normalizedResult);
        const evaluatedResult = evaluateExpression(filteredResult);
        transcriptionDiv.innerHTML = `${normalizedResult} = ${evaluatedResult}`;
    };

    recognition.onerror = function (event) {
        console.error('Speech recognition error: ', event.error);
    };

    startButton.addEventListener('click', function () {
        if (recognition && recognition.recording) {
            recognition.stop();
            startButton.disabled = false;
            startButton.style.backgroundColor = '';
            startButton.textContent = '🎤';
        } else {
            recognition.start();
            startButton.disabled = true;
            startButton.textContent = '🎤...';
        }
    });

    recognition.onend = function () {
        startButton.disabled = false; 
        startButton.textContent = '🎤 Start Recording';
    };

    function normalizeVoiceCommands(input) {
        const normalizedText = input
            .replace(/\b(lakh|lac|lacs)\b/gi, '00000')
            .replace(/\b(thousand|k)\b/gi, '000')
            .replace(/\b(million|mn)\b/gi, '000000');
        return normalizedText;
    }

    function filterArithmetic(input) {
        const filteredText = input.replace(/[^\d\+\-\*\/]/g, '');
        return filteredText;
    }

    function evaluateExpression(expression) {
        try {
            return eval(expression);
        } catch (error) {
            console.error('Error evaluating expression:', error);
            return 'Error';
        }
    }
});
