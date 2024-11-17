import React, { useState, useEffect } from "react";

function QuestionList() {
  const [questions, setQuestions] = useState([]);

  // Fetch questions on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:4000/questions');
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  // Delete a question
  const deleteQuestion = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/questions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setQuestions((prevQuestions) =>
          prevQuestions.filter((question) => question.id !== id)
        );
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  // Update the correct answer
  const updateCorrectAnswer = async (id, newCorrectIndex) => {
    try {
      const response = await fetch(`http://localhost:4000/questions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correctIndex: newCorrectIndex }),
      });

      if (response.ok) {
        const updatedQuestion = await response.json();
        setQuestions((prevQuestions) =>
          prevQuestions.map((question) =>
            question.id === id ? updatedQuestion : question
          )
        );
      }
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>
        {questions.map((question) => (
          <li key={question.id}>
            <p>{question.prompt}</p>
            <select
              value={question.correctIndex}
              onChange={(e) => updateCorrectAnswer(question.id, parseInt(e.target.value))}
            >
              {question.answers.map((answer, idx) => (
                <option key={idx} value={idx}>
                  {answer}
                </option>
              ))}
            </select>
            <button onClick={() => deleteQuestion(question.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default QuestionList;

