document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');

  document.querySelector('.start-button').addEventListener('click', startContest);
  document.querySelector('.regenerate-button').addEventListener('click', regenerateContest);
  document.querySelector('.end-button').addEventListener('click', endContest);
});

let timerInterval;
let totalTime = 60; // Default timer duration in minutes

function startContest() {
  console.log('Starting the contest...');
  loadQuestions();
  
  // Hide the start button and duration input
  document.querySelector('.start-button').style.display = 'none';
  document.querySelector('.input-container').style.display = 'none';
  
  // Show the regenerate and end buttons
  document.querySelector('.regenerate-button').style.display = 'inline-block';
  document.querySelector('.end-button').style.display = 'inline-block';

  // Show the timer and start it
  document.querySelector('.timer').classList.remove('hidden');
  startTimer();
}

function regenerateContest() {
  console.log('Regenerating contest...');
  loadQuestions();
}

function endContest() {
  console.log('Ending the contest...');
  
  // Show the start button and duration input
  document.querySelector('.start-button').style.display = 'inline-block';
  document.querySelector('.input-container').style.display = 'block';
  
  // Hide the regenerate and end buttons
  document.querySelector('.regenerate-button').style.display = 'none';
  document.querySelector('.end-button').style.display = 'none';
  
  // Hide the timer and stop it
  document.querySelector('.timer').classList.add('hidden');
  stopTimer();
  
  // Clear the questions
  document.querySelector('.question-list').innerHTML = '';
}

function loadQuestions() {
  console.log('Loading questions...');
  fetch('data/questions.json')
      .then(response => {
          console.log('Fetch response:', response);
          return response.json();
      })
      .then(data => {
          console.log('Questions data:', data);
          const easyQuestions = data.filter(q => q.difficulty === 'EASY');
          const mediumQuestions = data.filter(q => q.difficulty === 'MEDIUM');
          const hardQuestions = data.filter(q => q.difficulty === 'HARD');
          
          console.log('Easy questions:', easyQuestions);
          console.log('Medium questions:', mediumQuestions);
          console.log('Hard questions:', hardQuestions);
          
          const easyQuestion = getRandomQuestions(easyQuestions, 1);
          const mediumQuestionsSelected = getRandomQuestions(mediumQuestions, 2);
          const hardQuestion = getRandomQuestions(hardQuestions, 1);
          
          const questionList = [...easyQuestion, ...mediumQuestionsSelected, ...hardQuestion];
          console.log('Selected questions:', questionList);
          
          const formattedQuestions = questionList.map(q => ({
              title: q.title,
              url: `https://leetcode.com/problems/${q.titleSlug}/` // Correct URL construction
          }));
          
          console.log('Formatted questions:', formattedQuestions);
          displayQuestions(formattedQuestions);
      })
      .catch(error => console.error('Error loading questions:', error));
}

function displayQuestions(questions) {
  console.log('Displaying questions:', questions);
  const questionListDiv = document.querySelector('.question-list');
  questionListDiv.innerHTML = '';
  
  questions.forEach((q, index) => {
      console.log('Creating question item:', q);
      const questionItem = document.createElement('div');
      questionItem.className = 'question-item';
      
      const questionLink = document.createElement('a');
      questionLink.href = q.url;
      questionLink.target = '_blank';
      questionLink.textContent = q.title;
      
      const markButton = document.createElement('button');
      markButton.className = 'tick-button';
      markButton.textContent = 'Mark as Solved';
      markButton.onclick = () => toggleSolved(index);

            // Add a class based on index (for demonstration, adjust as needed)
      if (index === 0) {
        questionLink.className = 'easy';
      } else if (index === 1 || index === 2) {
        questionLink.className = 'medium';
      } else {
        questionLink.className = 'hard';
      }
      
      questionItem.appendChild(questionLink);
      questionItem.appendChild(markButton);
      questionListDiv.appendChild(questionItem);
  });
}

function toggleSolved(index) {
  console.log('Toggling solved state for question index:', index);
  const questions = document.querySelectorAll('.question-item');
  const question = questions[index];
  if (question.classList.contains('solved')) {
      question.classList.remove('solved');
  } else {
      question.classList.add('solved');
  }
}

function getRandomQuestions(questions, count) {
  console.log('Shuffling and selecting questions...');
  const shuffled = questions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function startTimer() {
  const durationInput = document.getElementById('duration');
  totalTime = parseInt(durationInput.value) || 60; // Default to 60 minutes if input is invalid
  let time = totalTime * 60; // Convert minutes to seconds
  updateTimerDisplay(time);

  timerInterval = setInterval(() => {
      if (time <= 0) {
          clearInterval(timerInterval);
          alert('Time is up!');
      } else {
          time--;
          updateTimerDisplay(time);
      }
  }, 1000);
}

function updateTimerDisplay(time) {
  const minutes = String(Math.floor(time / 60)).padStart(2, '0');
  const seconds = String(time % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

function stopTimer() {
  clearInterval(timerInterval);
}
