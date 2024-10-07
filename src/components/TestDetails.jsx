import React, { useState, useEffect } from 'react';
import { useParams, NavLink, useOutletContext } from 'react-router-dom';
import profpic from '../assets/profpic.png';
import axios from 'axios';

export const TestDetails = () => {
  const [questionsData, setQuestionsData] = useState([]); // Array for questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Store selected answers
  const [showResults, setShowResults] = useState(false); // Show results page
  const [score, setScore] = useState(0); // Track the score
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors
  const [questionName, setQuestionName] = useState('');
  const [questionType, setQuestionType] = useState(''); // Store question type

  const params = useParams();
  const { setSidebarOpen, user } = useOutletContext();
  const fileId = params.fileId;

  const questiondetailsurl = `http://16.171.33.87:8000/api/question_detail/${fileId}`;

  // Fetch question details
  const questionDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(questiondetailsurl, {
        withCredentials: true,
        headers: {
          Authorization: 'Token ' + localStorage.getItem('token'),
        },
      });

      const { question_detail, question_name, question_type } = response.data;

      // Convert `question_detail` to array for ToF questions
      const questions = typeof question_detail === 'object' && !Array.isArray(question_detail)
        ? Object.entries(question_detail).map(([key, value]) => ({ [key]: value }))
        : question_detail;

      setQuestionsData(questions || []);
      setQuestionName(question_name);
      setQuestionType(question_type);
    } catch (error) {
      setError('Failed to load question details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    questionDetails(); // Fetch question details on mount
  }, [fileId]);

  // Handle answer selection
  const handleAnswerSelect = (questionKey, answer) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionKey]: answer,
    }));
  };

  // Next question
  const handleNext = () => {
    if (currentQuestionIndex < questionsData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Calculate score
  const calculateScore = () => {
    let correctCount = 0;
    questionsData.forEach((questionObj) => {
      const questionKey = Object.keys(questionObj)[0];
      const correctAnswer = questionObj[questionKey].correct_answer;
      if (selectedAnswers[questionKey] === correctAnswer) {
        correctCount++;
      }
    });
    return correctCount;
  };

  // Handle submission
  const handleSubmit = async () => {
    const totalQuestions = questionsData.length;
    const answeredQuestions = Object.keys(selectedAnswers).length;

    if (answeredQuestions < totalQuestions) {
      alert('Please answer all questions.');
      return;
    }

    // Calculate score
    const score = calculateScore();
    setScore(score);

    try {
      const response = await axios.post(
        'http://16.171.33.87:8000/api/update_answers/',
        { file_id: fileId, answers: selectedAnswers, score: score },
        {
          withCredentials: true,
          headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
          },
        }
      );
      if (response.status === 200) {
        setShowResults(true);
      }
    } catch (error) {
      alert('An error has occurred, please try again');
    }
  };

  // Handle test retake (reset state)
  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setScore(0);
  };

  if (loading) {
    return (
      <>
        <div className="flex justify-between lg:justify-end items-center">
          {/* Left Side */}
          <div className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
              />
            </svg>
          </div>
          {/* Right Side */}
          <div className="flex justify-center items-center gap-4">
            <div className="flex items-center gap-2 bg-[#DAF2FF] w-fit py-2 px-2 rounded-2xl text-base lg:text-xl font-semibold">
              <img src={profpic} className="w-6 lg:w-full" alt="user" />
              <p>{user}</p>
            </div>
          </div>
        </div>
        <p className="text-center text-xl py-6">Loading...</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="flex justify-between lg:justify-end items-center">
          {/* Left Side */}
          <div className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"/>
            </svg>
          </div>
          {/* Right Side */}
          <div className="flex justify-center items-center gap-4">
            <div className="flex items-center gap-2 bg-[#DAF2FF] w-fit py-2 px-2 rounded-2xl text-base lg:text-xl font-semibold">
              <img src={profpic} className="w-6 lg:w-full" alt="user" />
              <p>{user}</p>
            </div>
          </div>
        </div>
        <p className="text-center text-xl py-6">{error}</p>
      </>
    );
  }

  // Get current question details
  const currentQuestion = questionsData[currentQuestionIndex];
  if (!currentQuestion) return null; // Safeguard in case of missing data

  const questionKey = Object.keys(currentQuestion)[0]; // Get the question number key (e.g., "1", "2", etc.)
  const questionContent = currentQuestion[questionKey]; // Get the actual question content

  // Show Results Page
// Show Results Page
if (showResults) {
    return (
      <div className="font-Inter text-[#313131] mx-auto w-11/12 lg:w-11/12">
        <div className="sticky top-0 bg-white py-2 lg:shadow-none flex justify-between lg:justify-end items-center">
        {/* Left Side */}
        <div className="lg:hidden" onClick={() => setSidebarOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"/>
          </svg>
        </div>
        {/* Right Side */}
        <div className="flex justify-center items-center gap-4">
          <div className="flex items-center gap-2 bg-[#DAF2FF] w-fit py-2 px-2 rounded-2xl text-base lg:text-xl font-semibold">
            <img src={profpic} className="w-6 lg:w-full" alt="user" />
            <p>{user}</p>
          </div>
          <div>
            <NavLink to="/user/generate" className="py-2 px-2 bg-[#0E2633] text-white rounded-xl text-base md:text-xl lg:text-2xl">
              Generate
            </NavLink>
          </div>
        </div>
      </div>
        <h2 className="text-4xl font-semibold text-center mb-4 mt-10">
          Test - {questionName}
        </h2>
        <h3 className="lg:text-5xl text-2xl text-center font-semibold mt-4 bg-green-300 w-fit mx-auto px-3 rounded-lg">
          Your Score: {score}/{questionsData.length}
        </h3>
  
        {/* Results List */}
        {questionsData.map((questionObj, index) => {
          const questionKey = Object.keys(questionObj)[0];
          const questionContent = questionObj[questionKey];
          const userAnswer = selectedAnswers[questionKey];
          const correctAnswer = questionContent.correct_answer;
  
          return (
            <div key={index} className="my-6 p-4 border-b border-gray-300">
              <p className="text-xl font-semibold">
                {index + 1}. {questionContent.question}
              </p>
              
              {/* Highlight based on question type */}
              {questionType === 'true or false' ? (
                // For True/False questions, compare values (True/False)
                Object.entries(questionContent.options).map(([optionKey, optionValue]) => (
                  <div key={optionKey} className="my-1">
                    <span
                      className={`inline-block px-3 py-1 rounded-lg ${
                        optionValue === correctAnswer
                          ? 'bg-green-200 text-green-700' // Correct answer in green
                          : userAnswer === optionValue
                          ? 'bg-red-200 text-red-700' // Wrong selected answer in red
                          : 'bg-gray-100'
                      }`}
                    >
                      {optionValue}
                    </span>
                  </div>
                ))
              ) : (
                // For MCQ questions, compare the keys (A, B, C, D)
                Object.entries(questionContent.options).map(([optionKey, optionValue]) => (
                  <div key={optionKey} className="my-1">
                    <span
                      className={`inline-block px-3 py-1 rounded-lg ${
                        optionKey === correctAnswer
                          ? 'bg-green-200 text-green-700' // Correct answer in green
                          : userAnswer === optionKey
                          ? 'bg-red-200 text-red-700' // Wrong selected answer in red
                          : 'bg-gray-100'
                      }`}
                    >
                      {optionValue}
                    </span>
                  </div>
                ))
              )}
            </div>
          );
        })}
  
        {/* Retake Button */}
        <div className="text-right mt-6">
          <button
            onClick={handleRetake}
            className="py-2 px-5 bg-blue-600 text-white font-semibold rounded-lg"
          >
            Retake Test
          </button>
        </div>
      </div>
    );
  }
  

  // Default Test Page (Before Submission)
  return (
    <div className="font-Inter text-[#313131] mx-auto w-11/12 lg:w-11/12">
      <div className="sticky top-0 bg-white py-2 lg:shadow-none flex justify-between lg:justify-end items-center">
        {/* Left Side */}
        <div className="lg:hidden" onClick={() => setSidebarOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"/>
          </svg>
        </div>
        {/* Right Side */}
        <div className="flex justify-center items-center gap-4">
          <div className="flex items-center gap-2 bg-[#DAF2FF] w-fit py-2 px-2 rounded-2xl text-base lg:text-xl font-semibold">
            <img src={profpic} className="w-6 lg:w-full" alt="user" />
            <p>{user}</p>
          </div>
          <div>
            <NavLink to="/user/generate" className="py-2 px-2 bg-[#0E2633] text-white rounded-xl text-base md:text-xl lg:text-2xl">
              Generate
            </NavLink>
          </div>
        </div>
      </div>
      {/* Question Display */}
      <div className="mt-8 p-4 bg-[#f1f8ff] rounded-lg">
        <h2 className="text-2xl lg:text-3xl font-semibold mb-4">{questionName}</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-xl lg:text-2xl font-semibold mb-4">
            {currentQuestionIndex + 1}. {questionContent.question}
          </p>

          {/* Render True/False or MCQ options based on question type */}
          {questionType === 'true or false' ? (
            Object.entries(questionContent.options).map(([key, value]) => (
              <div key={key} className="my-2">
                <label className="flex items-center space-x-3">
                  <input type="radio" name={`question-${questionKey}`} value={value}  checked={selectedAnswers[questionKey] === value} onChange={() => handleAnswerSelect(questionKey, value)} className="form-radio h-5 w-5 text-blue-600"/>
                  <span className="text-lg">{value}</span>
                </label>
              </div>
            ))
          ) : (
            Object.keys(questionContent.options).map((key) => (
              <div key={key} className="my-2">
                <label className="flex items-center space-x-3">
                  <input type="radio" name={`question-${questionKey}`} value={key} checked={selectedAnswers[questionKey] === key} onChange={() => handleAnswerSelect(questionKey, key)} className="form-radio h-5 w-5 text-blue-600" />
                  <span className="text-lg">{questionContent.options[key]}</span>
                </label>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-6">
        <button onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg disabled:opacity-50">Previous</button>
        {currentQuestionIndex < questionsData.length - 1 ? (<button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">Next</button>) : (<button onClick={handleSubmit} className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg">Submit</button>)}
      </div>

      {/* Question Pagination */}
      <div className="mt-6 flex flex-wrap lg:justify-center justify-start gap-4">
        {questionsData.map((_, index) => {
          const questionKey = Object.keys(questionsData[index])[0];
          const isAnswered = selectedAnswers.hasOwnProperty(questionKey);

          return (
            <button key={index} onClick={() => setCurrentQuestionIndex(index)} className={`w-8 h-8 p-2 flex items-center justify-center rounded-full ${index === currentQuestionIndex ? 'bg-blue-600 text-white' : isAnswered ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}> {index + 1} </button>
          );
        })}
      </div>
    </div>
  );
};