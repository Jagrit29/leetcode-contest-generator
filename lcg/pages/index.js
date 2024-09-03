"use client";
import { useState, useEffect } from 'react';

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [showContest, setShowContest] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90 * 60); // 90 minutes in seconds
  const [solvedQuestions, setSolvedQuestions] = useState(new Set()); // Track solved questions

  useEffect(() => {
    let timer;
    if (showContest && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timer);
      alert("Time's up!");
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [showContest, timeLeft]);

  const generateContest = async () => {
    try {
      // Fetch your question data (replace with your API endpoint or local file)
      const response = await fetch('/questions.json');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const easyQuestions = data.filter(q => q.difficulty === "EASY");
      const mediumQuestions = data.filter(q => q.difficulty === "MEDIUM");
      const hardQuestions = data.filter(q => q.difficulty === "HARD");
      const easyQuestion = getRandomQuestions(easyQuestions, 1);
      const mediumQuestionsSelected = getRandomQuestions(mediumQuestions, 2);
      const hardQuestion = getRandomQuestions(hardQuestions, 1);
      const questionList = [...easyQuestion, ...mediumQuestionsSelected, ...hardQuestion];
      // Construct URLs for questions
      const formattedQuestions = questionList.map(q => ({
        title: q.title,
        url: `https://leetcode.com/problems/${q.titleSlug}`
      }));
      setQuestions(formattedQuestions);
      setShowContest(true);
      setTimeLeft(90 * 60); // Reset the timer
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Failed to load questions. Please try again.');
    }
  };

  const getRandomQuestions = (questions, count) => {
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleSolved = (index) => {
    setSolvedQuestions(prevSolved => {
      const newSolved = new Set(prevSolved);
      if (newSolved.has(index)) {
        newSolved.delete(index);
      } else {
        newSolved.add(index);
      }
      return newSolved;
    });
  };

  return (
    <div className="container">
      <h1 className="title">LeetCode Contest Generator</h1>
      {!showContest && (
        <button className="start-button" onClick={generateContest}>
          Start Contest
        </button>
      )}
      {showContest && (
        <div className="contest">
          <h2>Your Contest Questions</h2>
          <div className="question-list">
            {questions.map((q, index) => (
              <div key={index} className={`question-item ${solvedQuestions.has(index) ? 'solved' : ''}`}>
                <a href={q.url} target="_blank" rel="noopener noreferrer">{q.title}</a>
                <button className="tick-button" onClick={() => toggleSolved(index)}>
                  {solvedQuestions.has(index) ? 'Unmark' : 'Mark as Solved'}
                </button>
              </div>
            ))}
          </div>
          <div className="timer">
            Time Left: {formatTime(timeLeft)}
          </div>
          <br />
          <button className="button regenerate-button" onClick={generateContest}>
            Regenerate Contest
          </button>
        </div>
      )}
    </div>
  );
}
