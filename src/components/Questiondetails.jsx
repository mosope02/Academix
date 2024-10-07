import React, { useState, useEffect } from 'react';
import { useParams, NavLink, useOutletContext } from 'react-router-dom';
import profpic from '../assets/profpic.png';
import axios from 'axios';

export const QuestionDetail = () => {
  const [questionsData, setQuestionsData] = useState([]); // Use an array to hold multiple questions
  const [showAnswer, setShowAnswer] = useState({}); // State to toggle answer visibility for each question
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors
  const [questionName, setQuestionName] = useState(''); // Store the question name
  const [questionType, setQuestionType] = useState(''); // Store the question type

  const params = useParams();
  const { setSidebarOpen, user } = useOutletContext();
  const fileId = params.fileId;

  // API endpoint for fetching question details
  const questiondetailsurl = `http://16.171.33.87:8000/api/question_detail/${fileId}`;

  // Function to fetch question details
  const questionDetails = async () => {
    setLoading(true); // Start loading before the request
    setError(null); // Clear previous errors
    try {
      const response = await axios.get(questiondetailsurl, {
        withCredentials: true,
        headers: {
          Authorization: 'Token ' + localStorage.getItem('token'),
        },
      });

      const { question_detail, question_name, question_type } = response.data;

      // Convert question_detail to array if it's an object (for True/False questions)
      const parsedQuestions = Object.keys(question_detail).map((key) => ({
        [key]: question_detail[key],
      }));

      setQuestionsData(parsedQuestions); // Store the parsed questions
      setQuestionName(question_name); // Set the question name
      setQuestionType(question_type); // Set the question type
    } catch (error) {
      console.error('Error fetching question details:', error);
      setError('Failed to load question details');
    } finally {
      setLoading(false); // Stop loading after the request completes
    }
  };

  useEffect(() => {
    questionDetails(); // Fetch question details on component mount
  }, [fileId]); // Dependency on fileId

  // Toggle answer visibility for a specific question
  const toggleAnswer = (key) => {
    setShowAnswer((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  if (loading) {
    return <p className="text-center text-xl py-6">Loading...</p>; // Show loading spinner or message
  }

  if (error) {
    return <p className="text-center text-xl py-6">{error}</p>; // Display error message
  }

  return (
    <div className="font-Inter text-[#313131] mx-auto w-11/12 lg:w-11/12">
      <div className="sticky top-0 bg-white py-2 shadow-md lg:shadow-none flex justify-between lg:justify-end items-center">
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
          <div>
            <NavLink
              to="/user/generate"
              className="py-2 px-2 bg-[#0E2633] text-white rounded-xl text-base md:text-xl lg:text-2xl"
            >
              Generate
            </NavLink>
          </div>
        </div>
      </div>

      <h2 className="text-4xl font-semibold mb-6 mt-6">{questionName}</h2>

      {/* Loop through questions */}
      {questionsData.map((questionObj, index) => {
        const questionKey = Object.keys(questionObj)[0]; // Get the question number (e.g., "1", "2", "3")
        const questionData = questionObj[questionKey]; // Get the actual question data

        return (
          <div key={questionKey} className="mb-8 border-b border-gray-300 pb-6">
            {/* Question Number and Text */}
            <h3 className="text-lg font-bold mb-4">
              {index + 1}. {questionData.question}
            </h3>

            {/* Conditional rendering for True/False or MCQ */}
            {questionType === 'true or false' ? (
              // True/False Options
              <ul className="list-none pl-4">
                <li className="mb-2">
                  <span className="font-semibold">T.</span> True
                </li>
                <li className="mb-2">
                  <span className="font-semibold">F.</span> False
                </li>
              </ul>
            ) : (
              // MCQ Options
              <ul className="list-none pl-4">
                {Object.entries(questionData.options).map(([optionKey, optionValue]) => (
                  <li key={optionKey} className="mb-2">
                    <span className="font-semibold">{optionKey}.</span> {optionValue}
                  </li>
                ))}
              </ul>
            )}

            {/* Answer Toggle */}
            <div className="mt-4">
              <button
                className="text-blue-600 hover:underline focus:outline-none"
                onClick={() => toggleAnswer(questionKey)}
              >
                {showAnswer[questionKey] ? 'Hide Answer' : 'Show Answer'}
              </button>

              {showAnswer[questionKey] && (
                <p className="text-lg mt-2 text-green-600 font-semibold">
                  Correct Answer: {questionData.correct_answer}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
